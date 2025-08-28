CURRENT_PATH=$(dirname $(readlink -f $0));

WATCHER_FILE_PATH="${CURRENT_PATH}/watch-changed-files.sh"

# ${WATCHER_FILE_PATH} w="./**/*.js ./**/*.ts ./*.js ./*.ts ./.env ./*.json" x="clear; npm run start"
${WATCHER_FILE_PATH} w="./**/*.js ./**/*.ts ./*.js ./*.ts ./*.sh ./.env ./*.json" x="clear; bash ./run.sh"
