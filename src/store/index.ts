import { INotificacao } from "@/interfaces/INotificacao";
import { InjectionKey } from "vue";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { ALTERAR_TAREFA, CADASTRAR_TAREFAS, OBTER_TAREFAS } from "./tipo_acoes";
import { ADICIONA_TAREFAS, ALTERA_TAREFA, DEFINIR_TAREFAS, NOTIFICAR } from "./tipo_mutacoes";
import http from '@/http'
import ITarefa from "@/interfaces/ITarefa";
import { EstadoProjeto, projeto } from "./modulos/projeto";

export interface Estado {
    tarefas: ITarefa[]
    notificacoes: INotificacao[],
    projeto: EstadoProjeto
}

export const key: InjectionKey<Store<Estado>> = Symbol()

export const store = createStore<Estado>({
    state: {
        tarefas: [],
        notificacoes: [],
        projeto: {
            projetos: []
        }
    },
    mutations: {        
        [NOTIFICAR](state, novaNotificacao: INotificacao){
            novaNotificacao.id = new Date().getTime()

            state.notificacoes.push(novaNotificacao)

            setTimeout(() => {
                state.notificacoes = state.notificacoes.filter(not => not.id != novaNotificacao.id)
            }, 3000)
        },        
        [ADICIONA_TAREFAS](state, tarefa: ITarefa){            
            state.tarefas.push(tarefa)
        },
        [DEFINIR_TAREFAS](state, tarefas: ITarefa[]){
            state.tarefas = tarefas
        },
        [ALTERA_TAREFA](state, tarefa: ITarefa){
            const index = state.tarefas.findIndex(taref => taref.id == tarefa.id)
            state.tarefas[index] = tarefa
        },
    },
    actions: {        
        [OBTER_TAREFAS]({ commit }){
            http.get('tarefas')
                .then(resposta => commit(DEFINIR_TAREFAS, resposta.data))
        },
        [CADASTRAR_TAREFAS]({ commit }, tarefa: ITarefa){
            return http.post('tarefas', tarefa)
                .then(resposta => commit(ADICIONA_TAREFAS, resposta.data))
        },
        [ALTERAR_TAREFA]({ commit }, tarefa: ITarefa){
            return http.put(`tarefas/${tarefa.id}`, tarefa)   
                .then(() => commit(ALTERA_TAREFA, tarefa))
        },
    },
    modules:{
        projeto
    }
})

export function useStore(): Store<Estado> {
    return vuexUseStore(key)
}