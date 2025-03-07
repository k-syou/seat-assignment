<template>
  <div class="seat-assignment">
    <h2>자리 배치도</h2>
    <div class="controls">
      <button @click="assignRandomSeats" class="control-button">랜덤 배치</button>
      <button @click="assignWeightedSeats" class="control-button">가중치 배치</button>
      <div class="save-layout">
        <input v-model="selectedLayoutName" placeholder="배치도 이름" class="layout-name-input" />
        <button @click="saveCurrentLayout" class="control-button">배치 저장</button>
      </div>
      <button @click="clearSeats" class="control-button">초기화</button>
    </div>

    <!-- 저장된 배치도 목록 -->
    <div class="saved-layouts" v-if="layouts.length > 0">
      <h3>저장된 배치도</h3>
      <div class="layout-list">
        <div
          v-for="layout in layouts"
          :key="layout._id"
          class="layout-item"
          @click="loadLayout(layout._id)"
        >
          {{ layout.name }}
          <span class="layout-date">
            {{ new Date(layout.createdAt).toLocaleDateString() }}
          </span>
        </div>
      </div>
    </div>

    <div class="seat-grid">
      <div v-for="row in 5" :key="`row-${row}`" class="seat-row">
        <div
          v-for="col in 6"
          :key="`seat-${row}-${col}`"
          class="seat"
          :class="{
            'seat-occupied': isSeatOccupied(row, col),
            'seat-disabled': isDisabledSeat(row, col),
          }"
        >
          {{ getSeatLabel(row, col) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// students를 ref로 변경
const students = ref([])

// const apiClient = axios.create({
//   baseURL: 'https://seat-assignment-back.vercel.app',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// 학생 목록 불러오기
const loadStudents = async () => {
  try {
    const response = await axios.get('/api/students')
    // const response = await apiClient.get('/api/students')
    // const response = await axios.get('https://seat-assignment-back.vercel.app/api/students')
    console.log(response)
    // 받아온 데이터에서 name 속성만 추출
    students.value = response.data.map(student => student.name)
    console.log(students.value)
  } catch (error) {
    console.error('학생 목록 로딩 실패:', error)
    alert('학생 목록을 불러오는데 실패했습니다.')
  }
}

// localStorage에서 이전 배치 불러오기
const loadPreviousLayout = async () => {
  const response = await axios.get('/api/seating-layouts')
  // const response = await apiClient.get('/api/seating-layouts')
  console.log(response)
  if (response) {
    let tmpLayout = new Map()
    Object.entries(response.data[response.data.length - 1].layout).map(([key,value]) => {
      tmpLayout.set(key, value)
    })
    console.log(`loadPreviousLayout : `, tmpLayout)
    previousLayout.value = tmpLayout;
  }
}

const occupiedSeats = ref(new Map())
const disabledSeats = ref([
  // 여기에 비활성화할 좌석 위치를 추가
  { row: 1, col: 1 },
  { row: 2, col: 1 },
  { row: 3, col: 1 },
  { row: 4, col: 1 },
  { row: 5, col: 1 },
  { row: 1, col: 6 },
  { row: 2, col: 6 },
  { row: 3, col: 6 },
  { row: 5, col: 6 },
])

const previousLayout = ref(new Map())

// 각 열의 범위 정의
const FRONT_ROWS = [1, 2]
const BACK_ROWS = [4, 5]

// 자리 위치에 따른 가중치 계산
const calculateWeight = (student) => {
  const prevSeat = findPreviousSeat(student)
  if (!prevSeat) return 0.5 // 이전 기록이 없으면 중립적 가중치

  // 이전에 앞쪽에 앉았으면 뒤쪽 선호도 증가
  if (FRONT_ROWS.includes(prevSeat.row)) {
    return {
      frontWeight: 0.2, // 앞자리 배정 확률 감소
      backWeight: 0.8, // 뒷자리 배정 확률 증가
    }
  }
  // 이전에 뒤쪽에 앉았으면 앞쪽 선호도 증가
  if (BACK_ROWS.includes(prevSeat.row)) {
    return {
      frontWeight: 0.8, // 앞자리 배정 확률 증가
      backWeight: 0.2, // 뒷자리 배정 확률 감소
    }
  }
  // 중간 열이었다면 중립적 가중치
  return {
    frontWeight: 0.5,
    backWeight: 0.5,
  }
}

// 학생의 이전 자리 찾기
const findPreviousSeat = (student) => {
  for (const [key, value] of previousLayout.value.entries()) {
    if (value === student) {
      const [row, col] = key.split('-').map(Number)
      return { row, col }
    }
  }
  return null
}

// 가중치 기반 자리 배치
const assignWeightedSeats = () => {
  clearSeats()
  const availableSeats = getAvailableSeats()
  const frontSeats = availableSeats.filter((seat) => FRONT_ROWS.includes(seat.row))
  const backSeats = availableSeats.filter((seat) => BACK_ROWS.includes(seat.row))
  const middleSeats = availableSeats.filter(
    (seat) => !FRONT_ROWS.includes(seat.row) && !BACK_ROWS.includes(seat.row),
  )

  const shuffledStudents = shuffleArray([...students.value])

  shuffledStudents.forEach((student, index) => {
    setTimeout(() => {
      const weights = calculateWeight(student)
      const random = Math.random()

      let selectedSeat = null

      // 가중치에 따라 자리 선택
      if (random < weights.frontWeight && frontSeats.length > 0) {
        const index = Math.floor(Math.random() * frontSeats.length)
        selectedSeat = frontSeats.splice(index, 1)[0]
      } else if (random < weights.frontWeight + weights.backWeight && backSeats.length > 0) {
        const index = Math.floor(Math.random() * backSeats.length)
        selectedSeat = backSeats.splice(index, 1)[0]
      } else if (middleSeats.length > 0) {
        const index = Math.floor(Math.random() * middleSeats.length)
        selectedSeat = middleSeats.splice(index, 1)[0]
      }
      // 선택된 자리가 없으면 남은 자리 중에서 무작위 선택
      if (!selectedSeat) {
        const remainingSeats = [...frontSeats, ...middleSeats, ...backSeats]
        if (remainingSeats.length > 0) {
          const index = Math.floor(Math.random() * remainingSeats.length)
          selectedSeat = remainingSeats[index]
          // 선택된 자리를 해당 배열에서 제거
          ;[frontSeats, middleSeats, backSeats].forEach((array) => {
            const idx = array.findIndex(
              (seat) => seat.row === selectedSeat.row && seat.col === selectedSeat.col,
            )
            if (idx !== -1) array.splice(idx, 1)
          })
        }
      }

      if (selectedSeat) {
        occupiedSeats.value.set(`${selectedSeat.row}-${selectedSeat.col}`, student)
        occupiedSeats.value = new Map(occupiedSeats.value)
      }
    }, index * (300 - index * 8)) // 500ms 지연 (필요에 따라 조정 가능)
  })
}

const layouts = ref([]) // 저장된 배치도 목록
const selectedLayoutName = ref('') // 새 배치도 저장 시 이름

// 서버에서 배치도 목록 불러오기
const loadLayouts = async () => {
  try {
    const response = await axios.get('/api/seating-layouts')
    // const response = await apiClient.get('/api/seating-layouts')
    layouts.value = response.data
  } catch (error) {
    console.error('배치도 로딩 실패:', error)
    alert('배치도 목록을 불러오는데 실패했습니다.')
  }
}

// 현재 배치 저장 (서버에 저장)
const saveCurrentLayout = async () => {
  if (!selectedLayoutName.value) {
    alert('배치도 이름을 입력해주세요.')
    return
  }

  try {
    const layoutData = {
      name: selectedLayoutName.value,
      layout: Object.fromEntries(occupiedSeats.value),
    }

    await axios.post('/api/seating-layouts', layoutData)
    // await apiClient.post('/api/seating-layouts', layoutData)
    alert('배치도가 저장되었습니다.')
    await loadLayouts() // 목록 새로고침
    selectedLayoutName.value = '' // 입력 필드 초기화
  } catch (error) {
    console.error('저장 실패:', error)
    alert('배치도 저장에 실패했습니다.')
  }
}

// 특정 배치도 불러오기
const loadLayout = async (layoutId) => {
  try {
    const response = await axios.get(`/api/seating-layouts/${layoutId}`)
    occupiedSeats.value = new Map(Object.entries(response.data.layout))
  } catch (error) {
    console.error('배치도 로딩 실패:', error)
    alert('배치도를 불러오는데 실패했습니다.')
  }
}

// 사용 가능한 좌석 목록 생성
const getAvailableSeats = () => {
  const seats = []
  for (let row = 1; row <= 5; row++) {
    for (let col = 1; col <= 6; col++) {
      if (!isDisabledSeat(row, col)) {
        seats.push({ row, col })
      }
    }
  }
  return seats
}

// 배열을 무작위로 섞는 함수
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// 랜덤 배치 함수
const assignRandomSeats = () => {
  clearSeats()
  const availableSeats = shuffleArray(getAvailableSeats())
  const shuffledStudents = shuffleArray([...students.value])

  shuffledStudents.forEach((student, index) => {
    if (index < availableSeats.length) {
      setTimeout(() => {
        const seat = availableSeats[index]
        occupiedSeats.value.set(`${seat.row}-${seat.col}`, student)
        occupiedSeats.value = new Map(occupiedSeats.value)
      }, index * 100)
    }
  })

  occupiedSeats.value = new Map(occupiedSeats.value)
}

// 좌석 초기화 함수
const clearSeats = () => {
  occupiedSeats.value = new Map()
}

const isDisabledSeat = (row, col) => {
  return disabledSeats.value.some((seat) => seat.row === row && seat.col === col)
}

const isSeatOccupied = (row, col) => {
  return occupiedSeats.value.has(`${row}-${col}`)
}

const getSeatLabel = (row, col) => {
  if (isDisabledSeat(row, col)) {
    return 'X'
  }
  const seatKey = `${row}-${col}`
  return occupiedSeats.value.get(seatKey) || `${row}-${col}`
}

// 컴포넌트 마운트 시 학생 목록 로드
onMounted(async () => {
  await loadStudents()
  await loadLayouts()
  await loadPreviousLayout()
})
</script>

<style scoped>
.seat-assignment {
  padding: 20px;
}

.seat-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.seat-row {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.seat {
  width: 80px;
  height: 80px;
  border: 2px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: white;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.seat:hover {
  border-color: #4bb4de;
  background-color: #f8f9fa;
}

.seat-occupied {
  background-color: #4bb4de;
  color: white;
  border-color: #398AC4;
}

.seat-occupied:hover {
  background-color: #398AC4;
}

.seat-disabled {
  background-color: #e9ecef;
  border-color: #dee2e6;
  cursor: not-allowed;
  color: #adb5bd;
}

.seat-disabled:hover {
  border-color: #dee2e6;
  background-color: #e9ecef;
}

.controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  justify-content: center;
}

.control-button {
  padding: 8px 16px;
  background-color: #398AC4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
  min-width: 100px; /* 버튼 크기 통일 */
}

.control-button:hover {
  background-color: #345da7;
}

.seat {
  font-size: 0.8rem; /* 이름이 들어갈 수 있도록 글자 크기 조정 */
  word-break: break-all;
  text-align: center;
  padding: 5px;
}

.save-layout {
  display: flex;
  gap: 10px;
  align-items: center;
}

.layout-name-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.saved-layouts {
  margin-top: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.layout-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.layout-item {
  padding: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.layout-item:hover {
  background-color: #e9ecef;
}

.layout-date {
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 5px;
}
</style>
