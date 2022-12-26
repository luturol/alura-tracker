<template>
    <div class="column is-three-quarter conteudo">
      <FormularioTarefa @aoSalvarTarefa="salvarTarefa"/>
      <div class="lista">       
        <Box v-if="listaEstaVazia">
          Você não está muito produtivo hoje :'(
        </Box>
        <Tarefa v-for="(tarefa, index) in tarefas" :key="index" :tarefa="tarefa" @aoTarefaClicada="selecionarTarefa" />        
        <div class="modal" :class="{ 'is-active': tarefaSelecionada}" v-if="tarefaSelecionada">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Modal title</p>
              <button class="delete" aria-label="close" @click="fecharModal"></button>
            </header>
            <section class="modal-card-body">
              <div class="field">
                <label for="descricao" class="label">
                    Descrição da Tarefa
                </label>
                <input type="text" class="input" v-model="tarefaSelecionada.descricao" id="nomeDoProjet" />                 
              </div>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-success" @click="alterarTarefa">Salvar Alterações</button>
              <button class="button" @click="fecharModal">Cancelar</button>
            </footer>
          </div>
        </div>
      </div>      
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import FormularioTarefa from '../components/Formulario.vue'
import Tarefa from '../components/Tarefa.vue'
import Box from '../components/Box.vue'
import { ALTERAR_TAREFA, CADASTRAR_TAREFAS, OBTER_PROJETOS, OBTER_TAREFAS } from '@/store/tipo_acoes';
import { useStore } from '@/store';
import ITarefa from '@/interfaces/ITarefa';

export default defineComponent({
  name: 'App',
  components: {    
    FormularioTarefa,
    Tarefa,
    Box
  },
  data(){
    return {
      tarefaSelecionada: null as ITarefa | null
    }
  },
  computed: {
    listaEstaVazia() : boolean {
      return this.tarefas.length === 0
    }
  },
  methods: {
    salvarTarefa(tarefa: ITarefa) {
      this.store.dispatch(CADASTRAR_TAREFAS, tarefa)
    },
    selecionarTarefa(tarefa: ITarefa){
      this.tarefaSelecionada = tarefa
    },
    fecharModal(){
      this.tarefaSelecionada = null
    },
    alterarTarefa(){
      this.store.dispatch(ALTERAR_TAREFA, this.tarefaSelecionada)
        .then(() => this.fecharModal())      
    }
  },
  setup() {
        const store = useStore()
        store.dispatch(OBTER_TAREFAS)
        store.dispatch(OBTER_PROJETOS)

        return {
            tarefas: computed(() => store.state.tarefas),
            store
        }
    }  
});
</script>
