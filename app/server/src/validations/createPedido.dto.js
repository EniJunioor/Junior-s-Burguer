import Joi from 'joi';

const createPedidoSchema = Joi.object({
  cliente: Joi.string().required(),
  usuarioId: Joi.string().uuid().required(),
  itens: Joi.array()
    .items(
      Joi.object({
        produtoId: Joi.string().uuid().required(),
        quantidade: Joi.number().integer().min(1).required(),
        preco: Joi.number().precision(2).required(),
      })
    )
    .min(1)
    .required(),
});

export default createPedidoSchema;
