import { TipoNotificacao } from "@/interfaces/INotificacao"
import { NOTIFICAR } from "@/store/tipo_mutacoes"
import { store } from '@/store'

export const notificacaoMixin = {
    methods: {
        notificar(tipo: TipoNotificacao, titulo: string, texto: string){
            store.commit(NOTIFICAR, {
               titulo,
               texto,
               tipo
           })
       }
    }
}