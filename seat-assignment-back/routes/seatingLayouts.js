import express from 'express'
import SeatingLayout from '../models/SeatingLayout.js'

const router = express.Router()

// 모든 배치도 조회
router.get('/', async (req, res) => {
  try {
    const layouts = await SeatingLayout.find().sort({ createdAt: -1 })
    res.json(layouts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// 새로운 배치도 저장
router.post('/', async (req, res) => {
  const layout = new SeatingLayout({
    name: req.body.name,
    layout: req.body.layout,
  })

  try {
    const newLayout = await layout.save()
    res.status(201).json(newLayout)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// 특정 배치도 조회
router.get('/:id', async (req, res) => {
  try {
    const layout = await SeatingLayout.findById(req.params.id)
    if (layout) {
      res.json(layout)
    } else {
      res.status(404).json({ message: '배치도를 찾을 수 없습니다' })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
