import * as React from 'react'
import { AddressElement, useElements } from '@stripe/react-stripe-js'
import { Box, Input, Text } from '@chakra-ui/react'

import countries from '@/context/countries.json'
import { StripeElementStatusEnum } from '@/enums'
import { StripeInputStatusType } from '@/types'

interface AddressInputProps {
  email: string
  status: StripeInputStatusType
  updateEmail: React.Dispatch<React.SetStateAction<string>>
  updateStatus: React.Dispatch<React.SetStateAction<StripeInputStatusType>>
  updateDeliveryCountry: React.Dispatch<React.SetStateAction<string>>
}

interface FormCompleteState {
  email: boolean
  stripeAddressEl: boolean
}

const AddressInput: React.FC<AddressInputProps> = ({
  email,
  status,
  updateEmail,
  updateStatus,
  updateDeliveryCountry,
}) => {
  const elements = useElements()

  const [formComplete, setFormComplete] = React.useState<FormCompleteState>({
    email: false,
    stripeAddressEl: false,
  })

  const [emailIsValid, setEmailIsValid] = React.useState(true)

  const deliveryCountry = React.useRef<string>('GB')

  const validEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  React.useEffect(() => {
    if (elements) {
      const addressEl = elements.getElement('address')

      if (addressEl) {
        addressEl.on('ready', () => {
          updateStatus((s) => ({
            ...s,
            addressEl: StripeElementStatusEnum.READY,
          }))
        })

        addressEl.on('change', (e) => {
          if (deliveryCountry.current !== e.value.address.country) {
            updateDeliveryCountry(e.value.address.country)
            deliveryCountry.current = e.value.address.country
          }

          if (e.complete !== formComplete.stripeAddressEl) {
            setFormComplete((fc) => ({
              ...fc,
              stripeAddressEl: e.complete,
            }))
          }
        })
      }
    }

    if (
      formComplete.email &&
      formComplete.stripeAddressEl &&
      status.addressEl !== StripeElementStatusEnum.COMPLETE
    ) {
      updateStatus((s) => ({
        ...s,
        addressEl: StripeElementStatusEnum.COMPLETE,
      }))
    } else if (
      (!formComplete.email || !formComplete.stripeAddressEl) &&
      status.addressEl !== StripeElementStatusEnum.READY
    ) {
      updateStatus((s) => ({
        ...s,
        addressEl: StripeElementStatusEnum.READY,
      }))
    }
  }, [formComplete, elements, status, updateStatus, updateDeliveryCountry])

  if (!elements) {
    console.error(
      'Cannot access stripe elements (make sure component is wrapped in a StripeLoader)'
    )
    return <></>
  }

  return (
    <>
      <Box mt={2} mb={3}>
        <Text>Email</Text>
        <Input
          borderColor='input.borderColor'
          focusBorderColor={emailIsValid ? 'brand.primary' : 'brand.error'}
          isInvalid={!emailIsValid}
          placeholder='Email address'
          onChange={(e) => {
            const newValue = e.target.value

            if (formComplete.email && !validEmailRegex.test(newValue)) {
              setFormComplete((fc) => ({
                ...fc,
                email: false,
              }))
            }

            updateEmail(newValue)
          }}
          onBlur={() => {
            const isValid = Boolean(
              email?.length && validEmailRegex.test(email)
            )

            setEmailIsValid(isValid)
            setFormComplete((fc) => ({
              ...fc,
              email: isValid,
            }))
          }}
          _hover={{
            borderColor: 'input.borderColor',
          }}
        />
        {!emailIsValid && (
          <Text color='brand.error' fontSize='sm'>
            Your email is invalid.
          </Text>
        )}
      </Box>
      <AddressElement
        options={{
          mode: 'shipping',
          allowedCountries: countries.map((c) => c.isoCode),
          defaultValues: {
            address: {
              country: 'GB',
            },
          },
          display: {
            name: 'split',
          },
          fields: {
            phone: 'always',
          },
          validation: {
            phone: {
              required: 'never',
            },
          },
        }}
      />
    </>
  )
}

export default AddressInput
