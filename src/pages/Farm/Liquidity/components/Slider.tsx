import {
  Slider as CkSlider,
  SliderProps,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box
} from '@chakra-ui/react'

export const Slider: React.FC<SliderProps> = props => {
  return (
    <CkSlider aria-label='slider-ex-4' {...props}>
      <SliderTrack bg='blue.100'>
        <SliderFilledTrack bg='blue.500' />
      </SliderTrack>
      <SliderThumb boxSize={6}>
        <Box bg='blue.500' borderRadius='full' boxSize={4} />
      </SliderThumb>
    </CkSlider>
  )
}
