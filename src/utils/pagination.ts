import { Request } from "restify"

export const makePagination = ({ params }: Request, count?: number) => ({
  size: params.limit || 50,
  page: Number.parseInt(params.page || 0),
  count
})

export const paginationToQuery = (req: Request) => {
  const { size, page } = makePagination(req)
  const getAll = req.params.all === 'true'
  return getAll ? {} : {
    limit: size,
    offset: page * size,
  }
}