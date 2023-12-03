// Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import Boardbar from './BoardBar'
import BoardContent from './BoardContent'

function Board() {
  return (
    <Container ontainer disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />

      <Boardbar />

      <BoardContent/>

    </Container>
  )
}

export default Board
