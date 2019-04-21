export class ILink {
  label: string;
  link: string;
}
export class INode {
  description: string;
  id: number;
  inputs: Array<string>;
  resources: Array<ILink>;
  name: string;
  node_seq: number;
  outputs: string;
  outputs_comments: string;
  project: number;
}
