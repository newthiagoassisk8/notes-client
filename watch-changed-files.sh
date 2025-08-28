#!/bin/bash

watch_file() {
    local VALID_PARAMS=(w l f LISTEN WATCH x EXEC TO_EXEC TO_LISTEN)

    for ARGUMENT in "$@"; do
        KEY=$(echo $ARGUMENT | cut -f1 -d=)

        if [[ "${VALID_PARAMS[@]}" =~ "${KEY}" ]]; then
            KEY_LENGTH=${#KEY}
            VALUE="${ARGUMENT:$KEY_LENGTH+1}"
            local "${KEY}"="${VALUE}"
        fi
    done

    w=${w:-$l}
    l=${l:-$w}
    l=${l:-$f}
    l=${l:-$LISTEN}
    l=${l:-$WATCH}

    x=${x:-$EXEC}

    TO_EXEC=${TO_EXEC:-$x}
    TO_LISTEN=${TO_LISTEN:-$l}

    if [[ -z $TO_EXEC || -z $TO_LISTEN ]]; then
        echo -e ""
        echo -e "TO_EXEC and TO_LISTEN params are required"
        echo -e ""
        exit 155
    fi

    echo -e "TO_EXEC: '${TO_EXEC}'"
    echo -e "TO_LISTEN: '${TO_LISTEN}'"
    echo -e ""

    clear
    while inotifywait -e close_write -e modify ${TO_LISTEN}; do
        bash -c "${TO_EXEC}"
    done # watch changes
}

# clear
watch_file "$@"
