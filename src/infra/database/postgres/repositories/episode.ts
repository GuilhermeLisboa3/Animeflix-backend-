import { CheckEpisodeByOrder, CreateEpisode, DeleteEpisodeById, LoadEpisode, LoadEpisodeById, UpdateEpisodeRepository } from '@/domain/contracts/database/episode'
import { Episode } from '@/infra/database/postgres/entities'

export class EpisodeRepository implements CheckEpisodeByOrder, CreateEpisode, LoadEpisodeById, UpdateEpisodeRepository, DeleteEpisodeById, LoadEpisode {
  async checkByOrder ({ order }: CheckEpisodeByOrder.Input): Promise<CheckEpisodeByOrder.Output> {
    const existEpisode = await Episode.findOne({ where: { order } })
    return existEpisode !== null
  }

  async create ({ name, animeId, order, synopsis, secondsLong, videoUrl }: CreateEpisode.Input): Promise<CreateEpisode.Output> {
    const episode = await Episode.create({ name, animeId, order, synopsis, secondsLong, videoUrl })
    return episode !== null
  }

  async loadById ({ id }: LoadEpisodeById.Input): Promise<LoadEpisodeById.Output> {
    const episode = await Episode.findOne({ attributes: [['video_url', 'videoUrl']], where: { id } })
    return episode !== null ? episode : undefined
  }

  async update ({ id, animeId, name, order, secondsLong, synopsis, videoUrl }: UpdateEpisodeRepository.Input): Promise<void> {
    const attributes = { animeId, name, order, secondsLong, synopsis, videoUrl }
    await Episode.update(attributes, { where: { id } })
  }

  async deleteById ({ id }: DeleteEpisodeById.Input): Promise<void> {
    await Episode.destroy({ where: { id } })
  }

  async load ({ animeId, order }: LoadEpisode.Input): Promise<LoadEpisode.Output> {
    const episode = await Episode.findOne({ where: { order, animeId } })
    if (episode) {
      return episode.videoUrl !== null ? episode.videoUrl : undefined
    }
  }
}
