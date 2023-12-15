import Box from '@mui/material/Box'
import { DndContext,
  // PointerSensor,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'

import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

const BoardContent = ({ board }) => {
  // Nếu dùng PonterSensor mặc định thì phải kết hợp thuộc tính css trouch-action: none ở những phần tử kéo thả - nhưng mà còn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // const mySensors = useSensors(pointerSensor)

  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug
  const mySensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng 1 thời điểm chỉ có 1 phần tử đang được kéo (column hoặc card)
  const [acitveDragItemId, setActiveDragItemId] = useState(null)
  const [acitveDragItemType, setActiveDragItemType] = useState(null)
  const [acitveDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Tìm 1 cái column theo CardId
  const findColumnByCardId = (cardId) => {
    // Nên dùng c.cards thay vì cardOrderIfds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho
    // cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column.cards?.map(card => card._id)?.includes(cardId))
  }

  // khi bắt đầu kéo 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ?
        ACTIVE_DRAG_ITEM_TYPE.CARD :
        ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // trong quá trình kéo (drag) 1 phần tử
  const handleDragOver = (event) => {
    // Không làm gì thêm nếu kéo column
    if (acitveDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // Nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi container) thì không làm gi
    const { active, over } = event
    if (!over || !active) return

    // activeDraggingCard: Là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card đang được kéo ở trên
    const { id: overCardId } = over

    // Tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 columns thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    /*
    - Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính
      column ban đâu của nó thì không làm gì
    - Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn lúc xử lý kéo xong xuôi thì nó lại là
      vấn đề khác ở (handleDragEnd)
    */
    if (activeColumn._id !== overColumn._id) {
      setOrderedColumns(prevColumns => {
        // tìm vị trí (index) của cái overCard trong column đích (nơi mà active card sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

        // Logic tính toán "cardIndex mowis" (trên hoặc dưới của overCard) lất chuẩn ra từ code của thư viện
        let newCardIndex
        const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect_height
        const modifier = isBelowOverItem ? 1 : 0
        newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

        // Clone mảng orderedColumnState cũ ra một cái mới để sử lý data rồi return
        const nextColumns = cloneDeep(prevColumns)
        const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
        const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

        // Column cũ
        if (nextActiveColumn) {
          // Xóa card ở cái column active (cũng có thể hiểu là colunm cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
          nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }

        // Column mới
        if (nextOverColumn) {
          // Kiểm tra xem card đang kéo có tồn tại overColumn chưa, nếu có thì cần xóa nó chưa
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
          // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)
          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }

        return nextColumns
      })
    }

  }

  // khi kết thúc kéo 1 phần tử
  const handleDragEnd = (event) => {
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return tránh lỗi)
    if (!over || !active) return

    // Xử lý kéo thả card
    if (acitveDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: Là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card đang được kéo ở trên
      const { id: overCardId } = over

      // Tìm 2 cái column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 columns thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      // Hành động kéo card giữa 2 column khác nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        // console.log('Hành động kéo thả card giữa 2 column khác nhau')
      } else {
        // Hành động kéo thả card trong cùng 1 cái column

        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === acitveDragItemId)
        // Lấy vị trí mới từ thằng over
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // Dùng arrayMove vì kéo card trong 1 cái column thì tương tự với logic kéo column trong 1 cái boardContent
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumns(prevColumns => {
          // Clone mảng OrderedColumsState cũ ra một cái mới để xử lý data
          const nextColumns = cloneDeep(prevColumns)

          // Tìm tới cái Column mà chúng ta đang thả
          const tagetColumn = nextColumns.find(card => card._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          tagetColumn.cards = dndOrderedCards
          tagetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          // Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }

    // Xử lý kéo thả column trong 1 boardContent
    if (acitveDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ từ thành active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Lấy vị trí mới từ thằng over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Dùng arrayMove của thằng dnd-kit để sắp xếp lại Columns ban đầu
        // Code của arrayMove ở đây: dnd-kit/packages/sortble/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // 2 cái console.log dữ liệu sau dùng để sử lý API
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
        // console.log('dndOrderedColumns', dndOrderedColumns)
        // console.log('dndOrderedColumnsIds', dndOrderedColumnsIds)

        // Cập nhật lại state sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns)
      }
    }

    // Những dữ liệu sau khi kéo thả này luôn phải đưa về giá trị null mặc định ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // Animation khi thả drop phần tử - test bằng cách kéo xong thả trực tiếp và nhin vào phần giữ chỗ overlay
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  return (
    <DndContext
      // Cảm biến
      sensors={mySensors}
      /*
      Thuật toán phát hiện va chạm (Nếu không có nó thì card với cover lớn sẽ không kéo qua Column được
      vì lúc này nó đang bị conflict giữa card và column), chúng ta sẽ dùng closestCorners
      */
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        height:(theme) => theme.trello.boardContentHeight,
        width:'100%',
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!acitveDragItemType && null }
          {(acitveDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={acitveDragItemData} />}
          {(acitveDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={acitveDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
