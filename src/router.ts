// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/article`
  | `/article/edit`
  | `/article/list`
  | `/home`
  | `/home/chat`
  | `/home/chat/components/AddFriend`
  | `/home/components`
  | `/home/post`
  | `/home/profile`
  | `/home/profile/user-list`
  | `/home/video`
  | `/login`
  | `/register`
  | `/seekback`

export type Params = {
  
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
