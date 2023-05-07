import * as Dialog from '@radix-ui/react-dialog'
import { HeaderContainer, HeaderContent, NewTransactionButton } from './styles'
import logoImg from '../../assets/logo.svg'
import { NewTransactionModal } from '../NewTransactionModal'
import { useState } from 'react'

export function Header() {
  const [openNewTransactionModal, setOpenNewTransactionModal] = useState(false)

  const onCloseNewTransactionModal = () => {
    setOpenNewTransactionModal(false)
  }

  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="" />

        <Dialog.Root
          open={openNewTransactionModal}
          onOpenChange={setOpenNewTransactionModal}
        >
          <Dialog.Trigger asChild>
            <NewTransactionButton>Nova transação</NewTransactionButton>
          </Dialog.Trigger>

          <NewTransactionModal onClose={onCloseNewTransactionModal} />
        </Dialog.Root>
      </HeaderContent>
    </HeaderContainer>
  )
}
