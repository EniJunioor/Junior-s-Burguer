-- AlterTable
ALTER TABLE "ItemPedido" ADD COLUMN     "pontoCarne" TEXT;

-- CreateTable
CREATE TABLE "CustomizacaoItemPedido" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "itemPedidoId" TEXT NOT NULL,

    CONSTRAINT "CustomizacaoItemPedido_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CustomizacaoItemPedido" ADD CONSTRAINT "CustomizacaoItemPedido_itemPedidoId_fkey" FOREIGN KEY ("itemPedidoId") REFERENCES "ItemPedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;
