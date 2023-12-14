import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'

const BoardContent = () => {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      height:(theme) => theme.trello.boardContentHeight,
      width:'100%',
      p: '10px 0'
    }}>
      <ListColumns />
    </Box>
  )
}

export default BoardContent
