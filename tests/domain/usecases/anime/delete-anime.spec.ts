import { DeleteAnimeUseCase, DeleteAnime } from '@/domain/usecases/anime'
import { LoadAnimeById } from '@/domain/contracts/database/anime'
import { DeleteFile } from '@/domain/contracts/gateways'

import { MockProxy, mock } from 'jest-mock-extended'
import { NotFoundError } from '@/domain/errors'

describe('DeleteAnimeUseCase', () => {
  let animeRepository: MockProxy<LoadAnimeById>
  let fileStorage: MockProxy<DeleteFile>
  let makeAnime: { id: string }
  let sut: DeleteAnime

  beforeAll(() => {
    makeAnime = { id: '1' }
    animeRepository = mock()
    animeRepository.loadById.mockResolvedValue({ id: 1, name: 'any_name', synopsis: 'any_synopsis', thumbnailUrl: 'any_value' })
    fileStorage = mock()
  })

  beforeEach(() => {
    sut = DeleteAnimeUseCase(animeRepository, fileStorage)
  })

  it('should call LoadAnimeById with correct input', async () => {
    await sut(makeAnime)

    expect(animeRepository.loadById).toHaveBeenCalledWith(makeAnime)
    expect(animeRepository.loadById).toHaveBeenCalledTimes(1)
  })

  it('should return NotFoundError if LoadAnimeById returns undefined', async () => {
    animeRepository.loadById.mockResolvedValueOnce(undefined)

    const promise = sut(makeAnime)

    await expect(promise).rejects.toThrow(new NotFoundError('id'))
  })

  it('should call DeleteFile with correct input', async () => {
    await sut(makeAnime)

    expect(fileStorage.delete).toHaveBeenCalledWith({ fileName: 'any_value' })
    expect(fileStorage.delete).toHaveBeenCalledTimes(1)
  })
})
