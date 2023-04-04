import { GetCategoryUseCase, GetCategory } from '@/domain/usecases/category'
import { LoadCategoryById } from '@/domain/contracts/database/category'

import { mock, MockProxy } from 'jest-mock-extended'
import { NotFoundError } from '@/domain/errors'

describe('GetCategory', () => {
  let categoryRepository: MockProxy<LoadCategoryById>
  let category: { id: string }
  let sut: GetCategory

  beforeAll(() => {
    categoryRepository = mock()
    categoryRepository.loadById.mockResolvedValue({ id: 'any_id', name: 'any_name', position: 1 })
    category = { id: '1' }
  })

  beforeEach(() => {
    sut = GetCategoryUseCase(categoryRepository)
  })

  it('should call LoadCategoryById with correct input', async () => {
    await sut(category)

    expect(categoryRepository.loadById).toHaveBeenCalledWith({ id: '1' })
    expect(categoryRepository.loadById).toHaveBeenCalledTimes(1)
  })

  it('should return NotFoundError if LoadCategoryById returns undefined', async () => {
    categoryRepository.loadById.mockResolvedValueOnce(undefined)

    const promise = sut(category)

    await expect(promise).rejects.toThrow(new NotFoundError('categoryId'))
  })
})
