#!/bin/bash
set -o errexit

# --------------------------------
# Common configs
# --------------------------------
# Project root path
ROOT_PATH=${PWD}
# Log prefix
LOG_PREFIX="[Op-s86hp]"
# Var data path
VAR_PATH=/data/var/s86hp

# --------------------------------
# Docker config
# --------------------------------
# repo
DOCKER_DEPO=registry.cn-shanghai.aliyuncs.com/gb-devteam/com-86skins
DOCKER_ORG_NAME=
DOCKER_IMAGE_NAME=s86hp
DOCKER_TAG=latest # default value
# service
DOCKER_STACK_NAME=gb_s86hp
DOCKER_SERVER_NAME=s86hp
# network
DOCKER_NETWORK=net-dou
DOCKER_HOST_PORT=8228
DOCKER_CONTAINER_PORT=80
DOCKER_HOST_PORT_ALL_ENV_SAME=0
DOCKER_CONTAINER_PORT_SAME_HOST=0
# user
DOCKER_EXEC_USER=65500
DOCKER_EXEC_GROUP=65500

# --------------------------------
# Terminal params
# --------------------------------
COMMAND=
# if common is start|stop|reload, then require
ENV=
# git pull branch, if null, then -b param require
GIT_BRANCH=
# Node modules installer
# @enum yarn | npm
NPM_INSTALLER=yarn
# Ignore git pull
NO_GIT_PULL=0
# Ignore npm install modules
NO_NPM_INSTALL=0
# Ignore npm build
NO_NPM_BUILD=0
# Ignore docker build
NO_DOCKER_BUILD=0
# Ignore server publish
NO_SER_PUBLISH=0

function usage() {
# `cat << EOF` This means that cat should stop reading when EOF is detected
cat << EOF
Usage: ./op.sh  [-h | --help]
                [-e | --env=sit|pre|prod]
                [-b | --branch=<gitBranchName>]
                [-t | --tag=<dockerTagName>]
                [--no-git-pull] [--no-npm-install] [--no-npm-build] [--no-docker-build] [--no-ser-publish]
                <command=see CommandEnums>

Param enums

-h,           --help                  Display help.
-e,           --env                   Set the env, some command require it.
-b,           --branch                Set the git branch name, if publish, then it is require.
-t,           --tag                   Set the docker tag name, default is latest.

Command enums
# start                    Start project proc.
# stop                     Stop project proc.
# reload                   Reload project proc, is stop proc then start proc.
# code-build               Code update and docker build with publish.
# create-var-dir           Create var dir. init project require.
# git-pull                 eq (git pull) command.
# npm-install              eq (npm install) | (yarn) command.
# docker-ps                eq (docker ps) command.
# docker-service-ls        eq (docker service ls) command.
# docker-exec              eq (docker exec) command.
EOF
}

# function logDebug(){
#   echo -e "[$(date +%Y-%m-%dT%H:%M:%S)][$$ $BASHPID][${FUNCNAME[1]}] [DEBUG]:   $*"|trim 1>&2
#   echo -e "[$(date +%Y-%m-%dT%H:%M:%S)][$$ $BASHPID][${FUNCNAME[1]}] [DEBUG]:   $*"|trim >> "${LOG_DIR}/$(date +%Y-%m-%d).debug.log" 2>&1
#   echo -e "[$(date +%Y-%m-%dT%H:%M:%S)][$$ $BASHPID][${FUNCNAME[1]}] [DEBUG]:   $*"|trim >> "${LOG_DIR}/$(date +%Y-%m-%d).log" 2>&1
# }

function checkEnvParam() {
    case ${ENV} in
        sit)
            ;;
        pre)
            ;;
        prod)
            ;;
        *) #default
            if [ -z ${ENV} ]; then
                echo "${LOG_PREFIX}unknow param.env(${ENV})."
            else
                echo "${LOG_PREFIX}param.env require."
            fi;
            usage
            exit 1;
            ;;
    esac
}

function createDir() {
    DIR=$1
    if [ ! -d ${DIR} ]; then
        mkdir -p ${DIR}
        setfacl -R -m u:${DOCKER_EXEC_USER}:rwx ${DIR}
    fi
}

function createVarDirs() {
    # local varPath=`getVarPath`
    # createDir ${varPath}
    return 0
}

function getVarChildDirPath() {
    local DIR=$1
    local varDir=`getVarPath`
    local childDir=${varDir}/${DIR}
    echo ${childDir}
    return 0
}

function getVarPath() {
    varDir=
    case ${ENV} in
        sit)
            varDir=${VAR_PATH}-sit
            ;;
        pre)
            varDir=${VAR_PATH}-pre
            ;;
        prod)
            varDir=${VAR_PATH}-prod
            ;;
        *) #default
            ;;
    esac
    echo ${varDir}
    return 0
}

function gitPull() {
    if [ -z ${GIT_BRANCH} ]; then
        echo "${LOG_PREFIX}param.branch require"
        usage
        exit 1
        # echo "${LOG_PREFIX}unknow param.branch(${GIT_BRANCH})."
    fi
    echo "${LOG_PREFIX}git rev-parse --verify --quiet ${GIT_BRANCH}, if shell exist, then the branch is not exist."
    git rev-parse --verify --quiet ${GIT_BRANCH}
    echo "${LOG_PREFIX}${FUNCNAME[1]} checkout ${GIT_BRANCH} branch"
    git checkout ${GIT_BRANCH}
    git reset --hard
    git pull
    return 0
}

function npmInstall() {
    case ${NPM_INSTALLER} in
    yarn)
        yarn
        ;;
    npm | *)
        npm install
        ;;
    esac
    return 0
}

function npmBuild() {
    case ${ENV} in
    sit)
        npm run build:sit
        ;;
    pre)
        npm run build:pre
        ;;
    prod)
        npm run build
        ;;
    esac
    return 0
}

function dockerImageName() {
    local tagName=${DOCKER_TAG}
    tagName=${tagName:-"latest"}
    local imageTag=""

    case ${ENV} in
    sit)
        imageName=${DOCKER_IMAGE_NAME}-sit
        imageTag=${DOCKER_ORG_NAME}${imageName}:${tagName}
        ;;
    pre)
        imageName=${DOCKER_IMAGE_NAME}-pre
        imageTag=${DOCKER_ORG_NAME}${imageName}:${tagName}
        ;;
    prod)
        imageName=${DOCKER_IMAGE_NAME}-prod
        imageTag=${DOCKER_ORG_NAME}${imageName}:${tagName}
        ;;
    esac

    echo ${imageTag}
    return 0
}

function dockerDepoUrl() {
    local depoUrl=""

    local imageName=`dockerImageName`

    case ${ENV} in
    sit)
        depoUrl=${DOCKER_DEPO}/${imageName}
        ;;
    pre)
        depoUrl=${DOCKER_DEPO}/${imageName}
        ;;
    prod)
        depoUrl=${DOCKER_DEPO}/${imageName}
        ;;
    esac

    echo ${depoUrl}
    return 0
}

function dockerContainerName() {
    local containerName=""

    case ${ENV} in
    sit)
        containerName=${DOCKER_IMAGE_NAME}-${ENV}
        ;;
    pre)
        containerName=${DOCKER_IMAGE_NAME}-${ENV}
        ;;
    prod)
        ;;
    esac

    echo ${containerName}
    return 0
}

function dockerNetworkName() {
    networkName=
    case ${ENV} in
        sit)
            networkName=${DOCKER_NETWORK}-sit
            ;;
        pre)
            networkName=${DOCKER_NETWORK}-pre
            ;;
        prod)
            ;;
        *) #default
            ;;
    esac
    echo ${networkName}
    return 0
}

function dockerBuild() {
    local branchName=${GIT_BRANCH}
    local tagName=${DOCKER_TAG}
    tagName=${tagName:-"latest"}
    local imageName=`dockerImageName`
    local depoUrl=`dockerDepoUrl`

    case ${ENV} in
    sit)
        docker image rm ${depoUrl} > /dev/null || true
        docker build -f sit.Dockerfile -t ${imageName} .
        docker tag ${imageName} ${depoUrl}
        docker push ${depoUrl}
        ;;
    pre)
        docker image rm ${depoUrl} > /dev/null || true
        docker build -f pre.Dockerfile -t ${imageName} .
        docker tag ${imageName} ${depoUrl}
        docker push ${depoUrl}
        ;;
    prod)
        docker image rm ${depoUrl} > /dev/null || true
        docker build -f Dockerfile -t ${imageName} .
        docker tag ${imageName} ${depoUrl}
        docker push ${depoUrl}
        ;;
    # *)
    #     ;;
    esac

    return 0
}

function dockerPs() {
    containerName=`dockerContainerName`
    docker ps -a | grep ${containerName}
}

function dockerServiceLs() {
    case ${ENV} in
    sit)
        dockerPs
        ;;
    pre)
        dockerPs
        ;;
    prod)
        docker service ls | grep ${DOCKER_STACK_NAME}
        ;;
    esac
}

function dockerExec() {
    case ${ENV} in
    sit)
        containerName=`dockerContainerName`
        docker exec -it $(docker ps -a | grep ${containerName} | awk '{print $1}') /bin/sh
        ;;
    pre)
        containerName=`dockerContainerName`
        docker exec -it $(docker ps -a | grep ${containerName} | awk '{print $1}') /bin/sh
        ;;
    prod)
        docker exec -it $(docker ps -a | grep ${DOCKER_IMAGE_NAME} | awk '{print $1}') /bin/sh
        ;;
    esac
}

function codeUpdateAndBuild() {
    if [ ${NO_GIT_PULL} == 0 ]; then
      echo "${LOG_PREFIX}${FUNCNAME[1]} gitPull run"
      gitPull
      echo "${LOG_PREFIX}${FUNCNAME[1]} gitPull end"
    else
      echo "${LOG_PREFIX}${FUNCNAME[1]} ignore gitPull"
    fi

    if [ ${NO_NPM_INSTALL} == 0 ]; then
      echo "${LOG_PREFIX}${FUNCNAME[1]} npmInstall run"
      npmInstall
      echo "${LOG_PREFIX}${FUNCNAME[1]} npmInstall end"
    else
      echo "${LOG_PREFIX}${FUNCNAME[1]} ignore npmInstall"
    fi

    if [ ${NO_NPM_BUILD} == 0 ]; then
      echo "${LOG_PREFIX}${FUNCNAME[1]} npmBuild run"
      npmBuild
      echo "${LOG_PREFIX}${FUNCNAME[1]} npmBuild end"
    else
      echo "${LOG_PREFIX}${FUNCNAME[1]} ignore npmBuild"
    fi

    if [ ${NO_DOCKER_BUILD} == 0 ]; then
      echo "${LOG_PREFIX}${FUNCNAME[1]} dockerBuild run"
      dockerBuild
      echo "${LOG_PREFIX}${FUNCNAME[1]} dockerBuild end"
    else
      echo "${LOG_PREFIX}${FUNCNAME[1]} ignore dockerBuild"
    fi
}

function startCommand() {
  echo "${LOG_PREFIX}${FUNCNAME[1]} run"
  local depoUrl=`dockerDepoUrl`

  if [ ${NO_SER_PUBLISH} == 0 ]; then
      # first run, check the dir and create its
      createVarDirs

      case ${ENV} in
          sit)
              containerName=`dockerContainerName`
              networkName=`dockerNetworkName`
              hostPort=${DOCKER_HOST_PORT}
              if [ ${DOCKER_HOST_PORT_ALL_ENV_SAME} != 1 ]; then
                hostPort="1${DOCKER_HOST_PORT}"
              fi
              containerPort=${DOCKER_CONTAINER_PORT}
              if [ ${DOCKER_CONTAINER_PORT_SAME_HOST} == 1 ]; then
                containerPort=${hostPort}
              fi

              local logDir=`getVarChildDirPath logs`
              # local runDir=`getVarChildDirPath run`
              local runConfigDir=`getVarChildDirPath run/config`

              docker run -d \
                  --name ${containerName} \
                  --network ${networkName} \
                  -p ${hostPort}:${containerPort} \
                  ${depoUrl}
              ;;
          pre)
              docker stack deploy \
                -c ${ROOT_PATH}/docker-stack-pre.yml ${DOCKER_STACK_NAME} \
                --with-registry-auth
              ;;
          prod)
              docker stack deploy \
                -c ${ROOT_PATH}/docker-stack.yml ${DOCKER_STACK_NAME} \
                --with-registry-auth
              ;;
          *) #default
              ;;
      esac
  else
    echo "${LOG_PREFIX}${FUNCNAME[1]} ignore service publish"
  fi

  echo "${LOG_PREFIX}${FUNCNAME[1]} end"
}

function stopCommand() {
  echo "${LOG_PREFIX}${FUNCNAME[1]} run"

  if [ ${NO_SER_PUBLISH} == 0 ]; then
      case ${ENV} in
          sit)
              containerName=${DOCKER_IMAGE_NAME}-sit
              docker stop ${containerName}
              docker rm ${containerName}
              ;;
          pre)
              # containerName=${DOCKER_IMAGE_NAME}-pre
              # docker stop ${containerName}
              # docker rm ${containerName}
              docker stack rm ${DOCKER_STACK_NAME}
              ;;
          prod)
              docker stack rm ${DOCKER_STACK_NAME}
              ;;
          *) #default
              ;;
      esac
  else
    echo "${LOG_PREFIX}${FUNCNAME[1]} ignore service publish"
  fi

  echo "${LOG_PREFIX}${FUNCNAME[1]} end"
}

function reloadCommand() {
  echo "${LOG_PREFIX}${FUNCNAME[1]} run"
  local depoUrl=`dockerDepoUrl`
  codeUpdateAndBuild
  if [ ${NO_SER_PUBLISH} == 0 ]; then
    case ${ENV} in
        sit)
            stopCommand
            startCommand
            ;;
        pre)
            docker service update ${DOCKER_STACK_NAME}_${DOCKER_SERVER_NAME} \
                --image ${depoUrl} \
                --with-registry-auth
            ;;
        prod)
            docker service update ${DOCKER_STACK_NAME}_${DOCKER_SERVER_NAME} \
                --image ${depoUrl} \
                --with-registry-auth
            ;;
        *) #default
            ;;
    esac
  else
    echo "${LOG_PREFIX}${FUNCNAME[1]} ignore service publish"
  fi

  echo "${LOG_PREFIX}${FUNCNAME[1]} end"
}

function createVarDirsCommand() {
    echo "${LOG_PREFIX}${FUNCNAME[1]} run"
    createVarDirs
    echo "${LOG_PREFIX}${FUNCNAME[1]} end"
}

function gitPullCommand() {
    if [ ${NO_GIT_PULL} == 0 ]; then
      echo "${LOG_PREFIX}${FUNCNAME[1]} gitPull run"
      gitPull
      echo "${LOG_PREFIX}${FUNCNAME[1]} gitPull end"
    else
      echo "${LOG_PREFIX}${FUNCNAME[1]} ignore gitPull"
    fi
}

function npmInstallCommand() {
    echo "${LOG_PREFIX}${FUNCNAME[1]} run"
    npmInstall
    echo "${LOG_PREFIX}${FUNCNAME[1]} end"
}

function main() {
    echo "${LOG_PREFIX}${FUNCNAME[1]} run"

    # exec command
    case ${COMMAND} in
        start)
            checkEnvParam
            codeUpdateAndBuild
            startCommand
            ;;
        stop)
            checkEnvParam
            stopCommand
            ;;
        reload)
            checkEnvParam
            reloadCommand
            ;;
        create-var-dir)
            checkEnvParam
            createVarDirsCommand
            ;;
        git-pull)
            gitPullCommand
            ;;
        npm-install)
            npmInstallCommand
            ;;
        code-build)
            checkEnvParam
            codeUpdateAndBuild
            ;;
        docker-ps)
            checkEnvParam
            dockerPs
            ;;
        docker-service-ls)
            checkEnvParam
            dockerServiceLs
            ;;
        docker-exec)
            checkEnvParam
            dockerExec
            ;;
        *) #default
            echo "${LOG_PREFIX}unknow command(${COMMAND})"
            usage
            exit 1
            ;;
    esac

    echo "${LOG_PREFIX}${FUNCNAME[1]} end"
}

# Logic - getopt
# echo original parameters=[$@]
ARGS=`getopt --alternative --options e:b:t:h:: --long env:,branch:,tag:,no-git-pull::,no-npm-install::,no-npm-build::,no-docker-build::,no-ser-publish::,help:: --name "$0" -- "$@"`
if [ $? != 0 ]; then
    echo "${LOG_PREFIX}Terminating..."
    exit 1
fi
eval set -- "${ARGS}"
# echo formatted parameters=[$@]
while true
do
    case "$1" in
        -e|--env)
            # echo "Option e, argument $2";
            ENV=${2}
            shift 2
            ;;
        -b|--branch)
            # echo "Option b, argument $2";
            GIT_BRANCH=${2}
            shift 2
            ;;
        -t|--tag)
            DOCKER_TAG=${2}
            shift 2
            ;;
        --no-git-pull)
            NO_GIT_PULL=1
            shift
            ;;
        --no-npm-install)
            NO_NPM_INSTALL=1
            shift
            ;;
        --no-npm-build)
            NO_NPM_BUILD=1
            shift
            ;;
        --no-docker-build)
            NO_DOCKER_BUILD=1
            shift
            ;;
        --no-ser-publish)
            NO_SER_PUBLISH=1
            shift
            ;;
        -h|--help)
            usage
            break
            ;;
        --)
            COMMAND=$2
            # case "$2" in
            #     "")
            #         echo "Option c, no argument";
            #         shift 2
            #         ;;
            #     *)
            #         echo "Option c, argument $2";
            #         shift 2;
            #         ;;
            # esac
            shift
            break
            ;;
        *)
            # echo "${LOG_PREFIX}Internal(${1}) error!"
            # exit 1
            shift
            ;;
    esac
done

# default vars change
if [ -z ${GIT_BRANCH} ]; then
  NO_GIT_PULL=1
fi

main
