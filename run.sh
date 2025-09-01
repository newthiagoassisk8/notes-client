#######################
# npm run start

#######################
execucao_simples_1() {
    tsx ./index.js add --title='Minha nota' --content='Conteúdo de run.sh | via função: execucao_simples_1 '
}

listagem_simples() {
    tsx ./index.js ls;

}


execucao_simples_quiet_1() {
    tsx ./index.js add --title='Minha nota' --output=quiet --content='Conteúdo de run.sh | via função: execucao_simples_quiet_1 '
}

execucao_simples_quiet_2() {
    tsx ./index.js add --title='Minha nota' --quiet --content='Conteúdo de run.sh | via função: execucao_simples_quiet_2 '
}

execucao_simples_quiet_3() {
    tsx ./index.js add --title='Minha nota' -q --content='Conteúdo de run.sh | via função: execucao_simples_quiet_3 '
}

# #######################
saida_simples_com_tags() {
    tsx ./index.js add \
        --title='Minha nota' \
        --output=json \
        --content='Conteúdo de run.sh | via função: saida_simples_com_tags' \
        --tags='tag1,tag2,1,,,,123abc, aaaa bbbbb cccc, algo-teste, @  , #  ,,     ,  '
}

#######################
saida_simples_com_saida_json() {
    tsx ./index.js add \
        --title='Minha nota' \
        --output=json \
        --content='Conteúdo de run.sh' \
        --tags='teste1,teste2'
}

#######################
saida_usando_jq_simples() {
    tsx ./index.js add \
        --title='Minha nota' \
        --output=json \
        --content='Conteúdo de run.sh' \
        --tags='teste1,teste2' | jq
}

#######################
saida_usando_jq_programaticamente() {
    local RESULT=$(tsx ./index.js add \
        --title='Minha nota' \
        --output=json \
        --content='Conteúdo de run.sh' \
        --tags='teste1,teste2')

    echo $RESULT | jq '.note'

    local NOTE_TITLE=$(echo $RESULT | jq '.note.title')
    local NOTE_ID=$(echo $RESULT | jq '.note.id')
    local NOTE_CREATION_DATE=$(echo $RESULT | jq '.note.createdAt')

    echo ""
    echo "NOTE_TITLE: ${NOTE_TITLE}"
    echo ""
    echo "NOTE_ID: ${NOTE_ID}"
    echo ""
    echo "NOTE_CREATION_DATE: ${NOTE_CREATION_DATE}"
    echo ""
}


####################### Update
put_saida_simples_com_saida_json() {
    tsx ./index.js --action=put \
        --title='Atualização de titulo ' \
        --id='39321c0f-480d-487c-877a-fe7128f51172' \
        --output=json \
        --content='Conteúdo de run.sh' \
        --tags='teste1,teste2'
}



######### EXECUTANDO AS FUNÇÕES ###########
# listagem_simples
put_saida_simples_com_saida_json
# execucao_simples_1
# saida_simples_com_tags
# saida_simples_com_saida_json
# saida_usando_jq_simples
# execucao_simples_quiet_1
# execucao_simples_quiet_2
# saida_usando_jq_programaticamente
