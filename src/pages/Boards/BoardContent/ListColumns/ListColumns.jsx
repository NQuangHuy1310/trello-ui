import { useState } from 'react'
import Column from './Column/Column'

import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { toast } from 'react-toastify'

const ListColumns = ({ columns, createNewColumn, createNewCard, deleteColumnDetails }) => {
	const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
	const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

	const [newColumnTitle, setNewColumnTitle] = useState('')

	const addNewColumn = () => {
		if (!newColumnTitle) {
			toast.error('Please Enter Column Title!')
			return
		}
		// Tạo dữ liệu Column để gọi API
		const newColumnData = {
			title: newColumnTitle
		}

		/**
		 * Gọi lên props function createNewColumn nằm ở component cha cao nhất (board/_id.jsx)
		 * Với việc sử dụng Redux thì code sẽ clean và chỉ chỉnh hơn
		 */
		createNewColumn(newColumnData)

		toggleOpenNewColumnForm()
		setNewColumnTitle('')
	}
	/*
    SortableContext yêu cầu items là một mạng dạng ['id-1','id-2'] chứ không phải [{id:'id-1'}, {id:'id-2'}]
    Nếu không đúng thì vẫn kéo thả được nhưng không có animation
  */
	return (
		<SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
			<Box
				sx={{
					bgcolor: 'inherit',
					width: '100%',
					height: '100%',
					display: 'flex',
					overflowX: 'auto',
					overflowY: 'hidden',
					'&::-webkit-scrollbar-track': { m: 1 }
				}}
			>
				{/* Box Column */}
				{columns?.map((column) => {
					return (
						<Column
							key={column._id}
							column={column}
							createNewCard={createNewCard}
							deleteColumnDetails={deleteColumnDetails}
						/>
					)
				})}

				{!openNewColumnForm ? (
					<Box
						sx={{
							minWidth: '250px',
							maxWidth: '250px',
							mx: 2,
							borderRadius: '6px',
							height: 'fit-content',
							bgcolor: '#ffffff3d'
						}}
						onClick={toggleOpenNewColumnForm}
					>
						<Button
							startIcon={<NoteAddIcon />}
							sx={{
								color: 'white',
								width: '100%',
								justifyContent: 'flex-start',
								pl: 2.5,
								py: 1
							}}
						>
							Add New Column
						</Button>
					</Box>
				) : (
					<Box
						sx={{
							minWidth: '250px',
							maxWidth: '250px',
							mx: 2,
							p: 1,
							borderRadius: '6px',
							height: 'fit-content',
							bgcolor: '#ffffff3d',
							display: 'flex',
							flexDirection: 'column',
							gap: 1
						}}
					>
						<TextField
							id="outlined-search"
							label="Enter column title..."
							type="text"
							size="small"
							variant="outlined"
							autoFocus
							value={newColumnTitle}
							onChange={(e) => setNewColumnTitle(e.target.value)}
							sx={{
								'& label': { color: 'white' },
								'& input': { color: 'white' },
								'& label.Mui-focused': { color: 'white' },
								'& .MuiOutlinedInput-root': {
									'& fieldset': { borderColor: 'white' },
									'&:hover fieldset': { borderColor: 'white' },
									'&.Mui-focused fieldset': { borderColor: 'white' }
								}
							}}
						/>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between'
							}}
						>
							<Button
								onClick={addNewColumn}
								variant="contained"
								color="success"
								size="small"
								sx={{
									boxShadow: 'none',
									border: '0.5px solid',
									borderColor: (theme) => theme.palette.success.main,
									'&:hover': { bgcolor: (theme) => theme.palette.success.main }
								}}
							>
								Add Column
							</Button>

							<CloseIcon
								fontSize="small"
								sx={{
									color: 'white',
									cursor: 'pointer',
									'&:hover': { color: (theme) => theme.palette.warning.light }
								}}
								onClick={toggleOpenNewColumnForm}
							/>
						</Box>
					</Box>
				)}
			</Box>
		</SortableContext>
	)
}

export default ListColumns
