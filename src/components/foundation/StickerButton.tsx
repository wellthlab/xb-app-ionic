import React from 'react'
import { MouseEvent, ReactNode} from 'react'

function StickerButton(props: ButtonProps) {
  const baseStyle = `rounded-[20px] h-[40px] text-label-large whitespace-nowrap ${
    props.icon
      ? 'pl-[16px] pr-[24px] flex items-center justify-center'
      : 'px-[24px]'
  }`
  const variants = {
    filled: 'bg-primary text-on-primary',
    elevated: '',
    tonal: 'bg-secondary-container text-on-secondary-container',
    outlined: 'border border-outline text-primary',
    text: `text-primary ${props.icon ? 'pl-[12px] pr-[16px]' : 'px-[12px]'}`,
  }

  return (
    <button
      className={`${baseStyle} ${variants[props.variant || 'filled']} ${
        props.className
      }`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.icon && <span className="mr-[8px]">{props.icon}</span>}
      {props.children}
    </button>
  )
}

type ButtonProps = {
  children: ReactNode
  className?: string
  variant?: 'filled' | 'elevated' | 'tonal' | 'outlined' | 'text'
  icon?: ReactNode
  onClick?: (event: MouseEvent) => void
  disabled?: boolean
}

export default StickerButton
