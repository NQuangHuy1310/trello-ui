// Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import Boardbar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import { fetchBoardDetailsAPI, createNewColumnApi, createNewCardApi, updateBoardDetailsAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'

import { useEffect, useState } from 'react'

function Board() {
	const [board, setBoard] = useState(null)

	useEffect(() => {
		// Fix cứng boardId, flow chuẩn chỉnh về sau sử dụng react-router-dom để lấy boardId từ URL về
		const boardId = '65b676b49d476454976820e5'
		// call API
		fetchBoardDetailsAPI(boardId).then((board) => {
			// Khi F5 trang web, cần xử lý vấn đề kéo thả vào một column rỗng
			board.columns.forEach((column) => {
				if (isEmpty(column.cards)) {
					column.cards = [generatePlaceholderCard(column)]
					column.cardOrderIds = [generatePlaceholderCard(column)._id]
				}
			})
			setBoard(board)
		})
	}, [])

	// func này có nhiệm vụ gọi API tạo mới column vào làm lại dữ liệu mới state board
	const createNewColumn = async (newColumnData) => {
		const createdColumn = await createNewColumnApi({
			...newColumnData,
			boardId: board._id
		})

		// Khi tạo column mới thì sẽ chưa có card, cần xử lý vấn đề kéo thẻ vào một column rỗng
		createdColumn.cards = [generatePlaceholderCard(createdColumn)]
		createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

		// cập nhật lại state board
		const newBoard = { ...board }
		newBoard.columns.push(createdColumn)
		newBoard.columnOrderIds.push(createdColumn._id)
		setBoard(newBoard)
	}

	// func này có nhiệm vụ gọi API tạo mới card vào làm lại dữ liệu mới state board
	const createNewCard = async (newCardData) => {
		const createdCard = await createNewCardApi({
			...newCardData,
			boardId: board._id
		})

		// cập nhật lại state board
		const newBoard = { ...board }
		const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId)
		if (columnToUpdate) {
			columnToUpdate.cards.push(createdCard)
			columnToUpdate.cardOrderIds.push(createNewCard._id)
			setBoard(newBoard)
		}
	}

	// func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong xuôi
	const moveColumns = async (dndOrderedColumns) => {
		// Update cho chuẩn dữ liệu state Board
		const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
		const newBoard = { ...board }
		newBoard.columns = dndOrderedColumns
		newBoard.columnOrderIds = dndOrderedColumnsIds
		setBoard(newBoard)

		// Call API update Board
		await updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
	}

	return (
		<Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
			<AppBar />

			<Boardbar board={board} />

			<BoardContent
				board={board}
				createNewColumn={createNewColumn}
				createNewCard={createNewCard}
				moveColumns={moveColumns}
			/>
		</Container>
	)
}

export default Board
