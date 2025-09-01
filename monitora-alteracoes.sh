CURRENT_PATH=$(dirname $(readlink -f $0));

WATCHER_FILE_PATH="${CURRENT_PATH}/watch-changed-files.sh"


bash "${WATCHER_FILE_PATH}" w="./**/*.js ./**/*.ts ./*.js ./*.sh ./*.ts ./.env ./*.json" x="clear; ./run.sh"
