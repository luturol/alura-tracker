export enum TipoNotificacao{
    SUCESSO,
    FALHA,
    ATENÇAO
}

export interface INotificacao{
    titulo: string,
    texto: string,
    tipo: TipoNotificacao,
    id: number
}