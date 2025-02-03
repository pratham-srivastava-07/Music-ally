import express from 'express'
import getAllTracks, { createTrack, deleteTrack, getSpecificTrack, trackBySpecificArtist, updateTrack } from '../controllers/tracks'

export const trackRouter = express.Router()

trackRouter.get('/',getAllTracks)
trackRouter.get('/:id', getSpecificTrack)
trackRouter.post('/:id', createTrack)
trackRouter.put('/:id', updateTrack)
trackRouter.delete('/:id', deleteTrack)
trackRouter.get('/artist/:artistId', trackBySpecificArtist)

// router.use('/tracks/:id', trackRouter) // getting a specific track
// router.use('/tracks', trackRouter) // POST creating a track
// router.use('/track/{id}', trackRouter) // PUT / PATCH on a specific track
// router.use('/track/{id}', trackRouter) // DELETE a track
// router.use('/tracks/artist/{artistId}', trackRouter) // GET all tracks by a specific artist