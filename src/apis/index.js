import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/*
* Lưu ý: Tất cả các function bên dưới chỉ lấy request và lấy data,
mà không có try catch hay then catch gì để bắt lỗi
* Lý do là vì phía Front-end chúng ta không cần thiết làm như vậy với mọi request bởi nó sẽ gây ra việc dự thừa code
* Giải pháp Clean Code gọn gàng là chúng ta sẽ catch lỗi tập trung tại mội nơi bằng tận dụng
một thức cực kì mạnh mẽ trong axios đó là Interceptors
* Hiểu đơn giản Interceptiors là cách mà chúng ta sẽ đánh chận vào giữa requét hoặc response để xử lý logic mà chúng ta muốn
*/

// Boards
export const fetchBoardDetailsAPI = async (boardId) => {
	const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
	// Lưu ý: axios sẽ trả về kết quả về qua property của nó là data
	return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
	const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
	return response.data
}

// Columns
export const createNewColumnApi = async (newColumnData) => {
	const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
	return response.data
}

// Cards
export const createNewCardApi = async (newCardData) => {
	const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
	return response.data
}
