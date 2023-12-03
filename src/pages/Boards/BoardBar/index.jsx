import Box from '@mui/material/Box'

const Boardbar = () => {
  return (
    <Box sx={{
      backgroundColor:'primary.dark',
      width:'100%',
      height:(theme) => theme.trello.boardBarHeight,
      display:'flex',
      alignItems:'center'
    }}>
      Borad Bar
    </Box>
  )
}

export default Boardbar
