import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

import Box from '@mui/material/Box'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'


const ListColumns = ({ columns }) => {
  /*
    SortableContext yêu cầu items là một mạng dạng ['id-1','id-2'] chứ không phải [{id:'id-1'}, {id:'id-2'}]
    Nếu không đúng thì vẫn kéo thả được nhưng không có animation
  */
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display:'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 1 }
      }}>
        {/* Box Column */}
        {columns?.map((column) => {
          return <Column key={column._id} column={column} />
        })}

        <Box sx={{
          minWidth:'200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}>
          <Button
            startIcon={<NoteAddIcon/>}
            sx={{
              color:'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }}
          >
            Add New Column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns