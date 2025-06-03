'use client'

import { useState } from 'react'
import { isAddress } from 'viem'

interface InputFormProps {
  initialRecipient?: string
  initialAmount?: bigint
  initialFrequency?: bigint
  onSubmitAction: (data: { recipient: string; amount: bigint; frequency: bigint }) => void
  disabled?: boolean
  className?: string
}

interface FormData {
  recipient: string
  amount: string
  frequency: string
}

interface ValidationErrors {
  recipient?: string
  amount?: string
  frequency?: string
}

interface ValidationRule {
  field: keyof FormData
  validator: (value: string, formData: FormData) => string | null
  message: string
}

export function InputForm({
  initialRecipient = '',
  initialAmount = BigInt(0),
  initialFrequency = BigInt(3600),
  onSubmitAction,
  disabled = false,
  className = ''
}: InputFormProps) {
  const [formData, setFormData] = useState<FormData>({
    recipient: initialRecipient,
    amount: initialAmount > 0 ? (Number(initialAmount) / 1e12).toString() : '',
    frequency: initialFrequency > 0 ? initialFrequency.toString() : '3600'
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<keyof FormData, boolean>>({
    recipient: false,
    amount: false,
    frequency: false
  })

  // Validation rules scaffold - easy to extend
  const validationRules: ValidationRule[] = [
    {
      field: 'recipient',
      validator: (value) => {
        if (!value.trim()) return 'Recipient address is required'
        if (!isAddress(value)) return 'Invalid Ethereum address'
        return null
      },
      message: 'Must be a valid Ethereum address'
    },
    {
      field: 'amount',
      validator: (value) => {
        if (!value.trim()) return 'Amount is required'
        const num = parseFloat(value)
        if (isNaN(num)) return 'Amount must be a valid number'
        if (num <= 0) return 'Amount must be greater than 0'
        if (num > 1000000) return 'Amount seems too large'
        return null
      },
      message: 'Must be a positive number'
    },
    {
      field: 'frequency',
      validator: (value) => {
        if (!value.trim()) return 'Frequency is required'
        const num = parseInt(value)
        if (isNaN(num)) return 'Frequency must be a valid number'
        if (num <= 0) return 'Frequency must be greater than 0'
        if (num < 60) return 'Frequency must be at least 60 seconds'
        if (num > 31536000) return 'Frequency cannot exceed 1 year'
        return null
      },
      message: 'Must be a positive number in seconds'
    }
  ]

  // Run validation
  const validateField = (field: keyof FormData, value: string): string | null => {
    const rule = validationRules.find(r => r.field === field)
    if (!rule) return null
    
    // Add more complex validation logic here later
    return rule.validator(value, formData)
  }

  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {}
    
    Object.keys(formData).forEach((field) => {
      const error = validateField(field as keyof FormData, formData[field as keyof FormData])
      if (error) {
        newErrors[field as keyof FormData] = error
      }
    })

    // Cross-field validation can be added here
    // Example: if (formData.amount && formData.frequency) { ... }
    
    return newErrors
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validate on change if field was already touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error || undefined }))
    }
  }

  const handleInputBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors(prev => ({ ...prev, [field]: error || undefined }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({ recipient: true, amount: true, frequency: true })
    
    const validationErrors = validateForm()
    setErrors(validationErrors)
    
    // If no errors, convert and submit
    if (Object.keys(validationErrors).length === 0) {
      try {
        const amount = BigInt(Math.floor(parseFloat(formData.amount) * 1e12)) // Convert to wei-like units
        const frequency = BigInt(parseInt(formData.frequency))
        
        onSubmitAction({
          recipient: formData.recipient.trim(),
          amount,
          frequency
        })
      } catch {
        setErrors({ amount: 'Invalid amount format' })
      }
    }
  }

  const isFormValid = Object.keys(validateForm()).length === 0 && 
                     formData.recipient.trim() && 
                     formData.amount.trim() && 
                     formData.frequency.trim()

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Recipient Address */}
      <div>
        <label htmlFor="recipient" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Recipient Address
        </label>
        <input
          type="text"
          id="recipient"
          value={formData.recipient}
          onChange={(e) => handleInputChange('recipient', e.target.value)}
          onBlur={() => handleInputBlur('recipient')}
          disabled={disabled}
          placeholder="0x..."
          className={`w-full px-4 py-3 border rounded-lg font-mono text-sm transition-colors
            ${errors.recipient && touched.recipient 
              ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 focus:border-circles-primary focus:ring-2 focus:ring-circles-primary/20'}
            dark:text-white`}
        />
        {errors.recipient && touched.recipient && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.recipient}</p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Amount (CRCs)
        </label>
        <input
          type="number"
          id="amount"
          step="0.000000000001"
          value={formData.amount}
          onChange={(e) => handleInputChange('amount', e.target.value)}
          onBlur={() => handleInputBlur('amount')}
          disabled={disabled}
          placeholder="0.001"
          className={`w-full px-4 py-3 border rounded-lg transition-colors
            ${errors.amount && touched.amount 
              ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 focus:border-circles-primary focus:ring-2 focus:ring-circles-primary/20'}
            dark:text-white`}
        />
        {errors.amount && touched.amount && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
        )}
      </div>

      {/* Frequency */}
      <div>
        <label htmlFor="frequency" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Frequency (seconds)
        </label>
        <input
          type="number"
          id="frequency"
          min="60"
          value={formData.frequency}
          onChange={(e) => handleInputChange('frequency', e.target.value)}
          onBlur={() => handleInputBlur('frequency')}
          disabled={disabled}
          placeholder="3600"
          className={`w-full px-4 py-3 border rounded-lg transition-colors
            ${errors.frequency && touched.frequency 
              ? 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20' 
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-300 focus:border-circles-primary focus:ring-2 focus:ring-circles-primary/20'}
            dark:text-white`}
        />
        {errors.frequency && touched.frequency && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.frequency}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Common values: 3600 (1 hour), 86400 (1 day), 604800 (1 week)
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled || !isFormValid}
        className={`w-full px-6 py-3 rounded-lg font-bold transition-colors
          ${disabled || !isFormValid 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400' 
            : 'bg-circles-primary hover:bg-circles-primary-dark text-white'
          }`}
      >
        {disabled ? 'Processing...' : 'Create Subscription'}
      </button>
      
      {/* Validation Summary - can be extended */}
      {Object.keys(errors).length > 0 && Object.values(touched).some(Boolean) && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-600 rounded-lg">
          <p className="text-sm text-red-800 dark:text-red-400 font-medium">
            Please fix the errors above before submitting
          </p>
        </div>
      )}
    </form>
  )
}