'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const currencyOptions = [
  { value: 'BRL', label: 'BRL — Real' },
  { value: 'USD', label: 'USD — Dólar' },
  { value: 'EUR', label: 'EUR — Euro' },
]

const addWalletSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  currency: z.enum(['BRL', 'USD', 'EUR']),
  initialBalance: z.coerce.number({ message: 'Informe um valor válido' }),
})

type AddWalletFormInput = z.input<typeof addWalletSchema>
type AddWalletValues = z.output<typeof addWalletSchema>

type AddWalletModalProps = {
  isOpen: boolean
  onClose: () => void
  onCreateWallet: (input: AddWalletValues) => Promise<boolean>
  isCreating: boolean
}

const AddWalletModal = ({ isOpen, onClose, onCreateWallet, isCreating }: AddWalletModalProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<AddWalletFormInput, unknown, AddWalletValues>({
    resolver: zodResolver(addWalletSchema),
    defaultValues: { name: '', currency: 'BRL', initialBalance: 0 },
  })

  const handleClose = () => {
    form.reset()
    setSubmitError(null)
    onClose()
  }

  const onSubmit = async (values: AddWalletValues) => {
    setSubmitError(null)
    const isSuccess = await onCreateWallet(values)
    if (!isSuccess) {
      setSubmitError('Erro ao criar carteira. Tente novamente.')
      return
    }
    form.reset()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-[6px] z-[200]"
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25, type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[201] ui-surface-dark border-t border-zinc-700 rounded-t-[20px] pb-8 max-h-[95vh] overflow-y-auto lg:max-w-lg lg:mx-auto lg:rounded-2xl lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:border lg:border-zinc-700"
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-zinc-700 lg:hidden" />
            </div>

            <div className="flex items-center justify-between px-6 pt-3 pb-5">
              <h2 className="text-foreground m-0 text-xl font-bold">Nova Carteira</h2>
              <Button
                variant="secondary"
                size="icon"
                className="bg-muted text-muted-foreground"
                onClick={handleClose}
              >
                <X size={16} />
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        NOME
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Conta Corrente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        MOEDA
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione a moeda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="initialBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground text-xs tracking-[0.8px]">
                        SALDO INICIAL
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value as number | string}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {submitError && <p className="text-expense text-sm text-center">{submitError}</p>}

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full mt-1 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold text-[15px]"
                >
                  {isCreating ? <Loader2 size={16} className="animate-spin" /> : 'Criar Carteira'}
                </Button>
              </form>
            </Form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AddWalletModal
