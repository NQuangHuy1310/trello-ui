// Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import Boardbar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI } from '~/apis'

import { useEffect, useState } from 'react'

function Board() {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    // Fix cứng boardId, flow chuẩn chỉnh về sau sử dụng react-router-dom để lấy boardId từ URL về
    const boardId = '65854fb5d3bb9fe76bbe9826'
    // call API
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />

      <Boardbar board={board} />

      <BoardContent board={board} />

    </Container>
  )
}

export default Board
