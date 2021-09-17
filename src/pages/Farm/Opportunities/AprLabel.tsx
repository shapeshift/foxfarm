import dayjs from 'dayjs'
import { WarningIcon } from '@chakra-ui/icons'
import {
  TagProps,
  PopoverProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tag,
  TagLabel,
  TagLeftIcon
} from '@chakra-ui/react'

type AprLabelProps = {
  popoverProps?: PopoverProps
  isEnded?: boolean
  apr: number
  periodFinish?: number
} & TagProps

export const AprLabel = ({ popoverProps, isEnded, periodFinish, apr, ...rest }: AprLabelProps) => {
  return isEnded ? (
    <Popover trigger='hover' placement='top-start' {...popoverProps}>
      <PopoverTrigger>
        <Tag colorScheme='red' {...rest}>
          <TagLeftIcon as={WarningIcon} />
          <TagLabel>Ended</TagLabel>
        </Tag>
      </PopoverTrigger>
      {periodFinish && (
        <PopoverContent maxWidth='250px'>
          <PopoverArrow />
          <PopoverHeader fontWeight='bold'>Reward Program Ended</PopoverHeader>
          <PopoverBody>
            This program ended on {dayjs.unix(periodFinish).format('MMM D, YYYY @ hh:mma')}
          </PopoverBody>
        </PopoverContent>
      )}
    </Popover>
  ) : (
    <Tag colorScheme='green' {...rest}>
      {`${apr}%`}
    </Tag>
  )
}
