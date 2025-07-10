// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/articles`
  | `/articles/components/hotlist`
  | `/articles/detail`
  | `/articles/edit`
  | `/campus`
  | `/chat`
  | `/chat/components/AddFriend`
  | `/components/campuscalander`
  | `/components/companyalumni`
  | `/info`
  | `/login`
  | `/profile`
  | `/profile/user-list`
  | `/register`
  | `/seekback`
  | `/video`

export type Params = {
  
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
