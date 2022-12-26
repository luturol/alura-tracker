<template>
    <div class="box formulario">
        <div class="columns">
            <div class="column is-6" role="form" aria-label="Fomulário para criação de uma nova tarefa">
                <input type="text" class="input" placeholder="Qual tarefa você deseja iniciar?" v-model="descricao" />
            </div>
            <div class="column is-2">
                <div class="select">
                    <select v-model="idProjeto">
                        <option value="">Selecione o projeto</option>
                        <option :value="projeto.id" v-for="projeto in projetos" :key="projeto.id">
                            {{ projeto.nome }}
                        </option>
                    </select>
                </div>
            </div>
            <div class="column">
                <TemporizadorTarefa @aoTemporizadorFinalizado="finalizarTarefa" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import TemporizadorTarefa from './Temporizador.vue'
import { useStore } from 'vuex'

import { key } from '@/store'
import { NOTIFICAR } from '@/store/tipo_mutacoes'
import { TipoNotificacao } from '@/interfaces/INotificacao'

export default defineComponent({
    name: 'FormularioTarefa',
    emits: ['aoSalvarTarefa'],
    components: {
        TemporizadorTarefa
    },
    setup(props, { emit }) {
        const descricao = ref("")
        const idProjeto = ref("")

        const store = useStore(key)

        const projetos =  computed(() => store.state.projeto.projetos)
        
        const finalizarTarefa = (tempoDecorrido: number): void => {
            const projeto = projetos.value.find(proj => proj.id == idProjeto.value)
            if (!projeto) {
                store.commit(NOTIFICAR, {
                    titulo: 'Ops!',
                    texto: "Selecione um projeto antes de finalizar a tarefa!",
                    tipo: TipoNotificacao.FALHA,
                })

                return
            }

            emit('aoSalvarTarefa', {
                duracaoEmSegundos: tempoDecorrido,
                descricao: descricao.value,
                projeto: projetos.value.find(proj => proj.id == idProjeto.value)
            })

            descricao.value = ''
        }
        
        return {
            descricao,
            idProjeto,
            store,
            projetos,
            finalizarTarefa
        }
    }
})
</script>

<style>
.formulario {
    color: var(--texto-primario);
    background-color: var(--bg-primario);
}
</style>