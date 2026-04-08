// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from '@generouted/react-router/client'

export type Path =
  | `/`
  | `/login`
  | `/navigator`
  | `/navigator/admin`
  | `/navigator/alumni-network`
  | `/navigator/campus`
  | `/navigator/campus/components/InterviewCard`
  | `/navigator/campus/components/InterviewForm`
  | `/navigator/campus/components/InterviewList`
  | `/navigator/campus/components/InterviewStats`
  | `/navigator/campus/detail`
  | `/navigator/chat`
  | `/navigator/chat/components/AddFriend`
  | `/navigator/components/campuscalander`
  | `/navigator/components/companyalumni`
  | `/navigator/components/favoritearticles`
  | `/navigator/dashboard`
  | `/navigator/explore`
  | `/navigator/explore/channel`
  | `/navigator/explore/components/creatorlist`
  | `/navigator/explore/components/hotlist`
  | `/navigator/info`
  | `/navigator/info/company`
  | `/navigator/notifications`
  | `/navigator/profile`
  | `/navigator/publish`
  | `/navigator/referrals`
  | `/navigator/referrals/:id`
  | `/navigator/referrals/detail`
  | `/navigator/referrals/detail/:id`
  | `/register`
  | `/seekback`

export type Params = {
  '/navigator/referrals/:id': { id: string }
  '/navigator/referrals/detail/:id': { id: string }
}

export type ModalPath = never

export const { Link, Navigate } = components<Path, Params>()
export const { useModals, useNavigate, useParams } = hooks<Path, Params, ModalPath>()
export const { redirect } = utils<Path, Params>()
