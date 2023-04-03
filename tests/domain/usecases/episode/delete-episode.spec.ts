import { DeleteEpisodeUseCase, DeleteEpisode } from '@/domain/usecases/episode'
import { LoadEpisodeById } from '@/domain/contracts/database/episode'

import { mock, MockProxy } from 'jest-mock-extended'
import { NotFoundError } from '@/domain/errors'
import { DeleteFile } from '@/domain/contracts/gateways'

describe('DeleteEpisodeUseCase', () => {
  let episodeRepository: MockProxy<LoadEpisodeById>
  let fileStorage: MockProxy<DeleteFile>
  let makeEpisode: { episodeId: string }
  let sut: DeleteEpisode

  beforeAll(() => {
    makeEpisode = { episodeId: '1' }
    episodeRepository = mock()
    episodeRepository.loadById.mockResolvedValue({ videoUrl: 'any_value' })
    fileStorage = mock()
  })

  beforeEach(() => {
    sut = DeleteEpisodeUseCase(episodeRepository, fileStorage)
  })

  it('should call LoadEpisodeById with correct input', async () => {
    await sut(makeEpisode)

    expect(episodeRepository.loadById).toHaveBeenCalledWith({ id: '1' })
    expect(episodeRepository.loadById).toHaveBeenCalledTimes(1)
  })

  it('should return NotFoundError if LoadEpisodeById returns undefined', async () => {
    episodeRepository.loadById.mockResolvedValueOnce(undefined)

    const promise = sut(makeEpisode)

    await expect(promise).rejects.toThrow(new NotFoundError('episodeId'))
  })

  it('should call DeleteFile with correct input', async () => {
    await sut(makeEpisode)

    expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: 'any_value' })
    expect(fileStorage.delete).toHaveBeenCalledTimes(1)
  })
})
