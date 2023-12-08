import Box from '@mui/material/Box'

const BoardContent = () => {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '##4495e' : '#1976d2'),
      width:'100%',
      height:(theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      display:'flex',
      alignItems:'center'
    }}>
      Borad Content
    </Box>
  )
}

export default BoardContent
