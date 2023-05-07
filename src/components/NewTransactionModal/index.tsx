import { useForm, Controller } from 'react-hook-form'
import { useContextSelector } from 'use-context-selector'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowCircleDown, ArrowCircleUp, X } from '@phosphor-icons/react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Z from 'zod'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import {
  Overlay,
  Content,
  CloseButton,
  TransactionType,
  TransactionTypeButton,
} from './styles'

const newTransactionFormSchema = Z.object({
  description: Z.string().nonempty(),
  price: Z.number().positive(),
  category: Z.string().nonempty(),
  type: Z.enum(['income', 'outcome']),
})

type NewTransactionFormSchemaType = Z.infer<typeof newTransactionFormSchema>

interface NewTransactionModalProps {
  onClose: () => void
}

export function NewTransactionModal({ onClose }: NewTransactionModalProps) {
  const createTransaction = useContextSelector(
    TransactionsContext,
    (context) => {
      return context.createTransaction
    },
  )

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm<NewTransactionFormSchemaType>({
    resolver: zodResolver(newTransactionFormSchema),
  })

  async function handleCreateNewTransaction(
    data: NewTransactionFormSchemaType,
  ) {
    await createTransaction(data)

    reset()
    onClose()
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova transação</Dialog.Title>
        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form action="" onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder="Descrição"
            required
            {...register('description')}
          />
          <input
            type="number"
            placeholder="Preço"
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Categoria"
            required
            {...register('category')}
          />

          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <TransactionType
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <TransactionTypeButton variant="income" value="income">
                    <ArrowCircleUp size={24} /> Entrada
                  </TransactionTypeButton>

                  <TransactionTypeButton variant="outcome" value="outcome">
                    <ArrowCircleDown size={24} /> Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }}
          />

          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}
