import { AddEpisodeUseCase, AddEpisode } from '@/domain/usecases/episode'
import { CheckAnimeById } from '@/domain/contracts/database/anime'

import { mock, MockProxy } from 'jest-mock-extended'
import { NotFoundError } from '@/domain/errors'

describe('AddEpisodeUseCase', () => {
  let animeRepository: MockProxy<CheckAnimeById>
  let makeEpisode: { animeId: number, order: number, name: string, synopsis: string, file?: { buffer: Buffer, mimeType: string } }
  let sut: AddEpisode

  beforeAll(() => {
    makeEpisode = { animeId: 1, name: 'any_name', order: 1, synopsis: 'any_synopsis', file: { buffer: Buffer.from('any'), mimeType: 'video/mp4' } }
    animeRepository = mock()
    animeRepository.checkById.mockResolvedValue(true)
  })

  beforeEach(() => {
    sut = AddEpisodeUseCase(animeRepository)
  })

  it('should call CheckAnimeById with correct input', async () => {
    await sut(makeEpisode)

    expect(animeRepository.checkById).toHaveBeenCalledWith({ id: 1 })
    expect(animeRepository.checkById).toHaveBeenCalledTimes(1)
  })

  it('should return NotFoundError if CheckAnimeById returns false', async () => {
    animeRepository.checkById.mockResolvedValueOnce(false)

    const promise = sut(makeEpisode)

    await expect(promise).rejects.toThrow(new NotFoundError('animeId'))
  })
})
