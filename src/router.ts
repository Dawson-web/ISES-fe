// Generouted, changes to this file will be overriden
/* eslint-disable */

import { components, hooks, utils } from "@generouted/react-router/client";

export type Path =
  | `/`
  | `/home`
  | `/home/article`
  | `/home/chat`
  | `/home/components`
  | `/home/post`
  | `/home/profile`
  | `/login`
  | `/register`
  | `/seekback`;

export type Params = {};

export type ModalPath = never;

export const { Link, Navigate } = components<Path, Params>();
export const { useModals, useNavigate, useParams } = hooks<
  Path,
  Params,
  ModalPath
>();
export const { redirect } = utils<Path, Params>();
