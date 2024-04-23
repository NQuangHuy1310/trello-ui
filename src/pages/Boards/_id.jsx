// Board Details
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import Boardbar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
// import { mockData } from '~/apis/mock-data'
import {
	fetchBoardDetailsAPI,
	createNewColumnApi,
	createNewCardApi,
	updateBoardDetailsAPI,
	updateColumnDetailsAPI,
	moveCardToDifferentColumnAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'

function Board() {
	const [board, setBoard] = useState(null)

	useEffect(() => {
		// Fix cứng boardId, flow chuẩn chỉnh về sau sử dụng react-router-dom để lấy boardId từ URL về
		const boardId = '65b676b49d476454976820e5'
		// call API
		fetchBoardDetailsAPI(boardId).then((board) => {
			// Sắp xếp thứ tjw các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
			board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

			board.columns.forEach((column) => {
				// Khi F5 trang web, cần xử lý vấn đề kéo thả vào một column rỗng
				if (isEmpty(column.cards)) {
					column.cards = [generatePlaceholderCard(column)]
					column.cardOrderIds = [generatePlaceholderCard(column)._id]
				} else {
					// Sắp xếp thứ tự các cards luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
					column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
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
			// Nếu column rỗng: bản chất là đang chứa một cái Placeholder card
			if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
				columnToUpdate.cards = [createNewCard]
				columnToUpdate.cardOrderIds = [createdCard._id]
			} else {
				// Ngược lại COlumn đã có data thì push vào cuối mảng
				columnToUpdate.cards.push(createdCard)
				columnToUpdate.cardOrderIds.push(createNewCard._id)
			}
		}
		setBoard(newBoard)
	}

	/*
	 * func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong xuôi
	 * Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong Board)
	 */
	const moveColumns = (dndOrderedColumns) => {
		// Update cho chuẩn dữ liệu state Board
		const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
		const newBoard = { ...board }
		newBoard.columns = dndOrderedColumns
		newBoard.columnOrderIds = dndOrderedColumnsIds
		setBoard(newBoard)

		// Call API update Board
		updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
	}

	/*
	 * Khi di chuyển card trong cùng column
	 * Chỉ cần gọi API để cập nhật mảng cardOrderIds của column chứa nó (thay đổi vị trí trong mảng)
	 */
	const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
		// Update cho chuẩn dữ liệu state Board
		const newBoard = { ...board }
		const columnToUpdate = newBoard.columns.find((column) => column._id === columnId)
		if (columnToUpdate) {
			columnToUpdate.cards = dndOrderedCards
			columnToUpdate.cardOrderIds = dndOrderedCardIds
		}
		setBoard(newBoard)

		// Gọi API update Column
		updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
	}

	/**
	 * Khi di chuyển card sang Column khác
	 * B1: Cập nhật mảng cardOrderIds của Column ban đầu chưa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
	 * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
	 * B3: Cập nhật lại trường columnId mới của các Card đã kéo
	 * => Làm một API support riêng
	 *  */
	const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
		// update lại cho dữ liệu state Board
		const dndOrderedCardIds = dndOrderedColumns.map((c) => c._id)
		const newBoard = { ...board }
		newBoard.columns = dndOrderedColumns
		newBoard.columnOrderIds = dndOrderedCardIds
		setBoard(newBoard)

		// Call API xử lý phía BE
		let prevCardOrderIds = dndOrderedColumns.find((c) => c._id === prevColumnId)?.cardOrderIds
		// Xử lý vấn đề khi kéo Card phần tử cuối cùng ra khỏi Column, Column rỗng sẽ có placeholder card, cần xóa nó đi trước khi gửi dữ liệu lên BE
		if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

		moveCardToDifferentColumnAPI({
			currentCardId,
			prevColumnId,
			prevCardOrderIds,
			nextColumnId,
			nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)?.cardOrderIds
		})
	}

	if (!board) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 2,
					width: '100vw',
					height: '100vh'
				}}
			>
				<CircularProgress />
				<Typography>Loading Board...</Typography>
			</Box>
		)
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
				moveCardInTheSameColumn={moveCardInTheSameColumn}
				moveCardToDifferentColumn={moveCardToDifferentColumn}
			/>
		</Container>
	)
}

export default Board
