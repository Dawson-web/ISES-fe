// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/login`
  | `/navigator`
  | `/navigator/articles`
  | `/navigator/articles/components/hotlist`
  | `/navigator/articles/detail`
  | `/navigator/articles/edit`
  | `/navigator/campus`
  | `/navigator/chat`
  | `/navigator/chat/components/AddFriend`
  | `/navigator/components/campuscalander`
  | `/navigator/components/companyalumni`
  | `/navigator/info`
  | `/navigator/profile`
  | `/navigator/profile/user-list`
  | `/register`
  | `/seekback`



export type Params = {
  
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
