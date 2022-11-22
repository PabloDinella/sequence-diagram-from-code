import { tsquery } from "@phenomnomnominal/tsquery";
import { SyntaxKind } from "typescript";

const typescript = `

import { integrationParamsSchema } from "domain/inputSchema/Integration/params";
import { FastifyRequest, FastifyReply, FastifyInstance } from "driver/http/fastify";
import { IntegrationUseCase, init as InitIntegrationUsecase } from "usecase/Integration";

class Animal {
    constructor(public name: string) { }
    move(distanceInMeters: number = 0) {
        console.log(\`\${this.name} moved \${distanceInMeters}m.\`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

export class IntegrationHandler {
  private integrationUseCase: IntegrationUseCase;

  constructor({
    router,
    integrationUseCase,
  }: {
    router: FastifyInstance;
    integrationUseCase: IntegrationUseCase;
  }) {
    this.integrationUseCase = integrationUseCase;

    router.get("/integrations/:uid", this.getIntegrationByUid);
    router.get("/integrations/:uid/teams", this.getIntegrationTeamsByUid);
  }

  public getIntegrationByUid = async (req: FastifyRequest, res: FastifyReply) => {
    const payload = integrationParamsSchema.safeParse(req.params);

    if (!payload.success) {
      return res.status(400).send(payload.error);
    }

    const response = await this.integrationUseCase.getIntegrationByUid({ uid: payload.data.uid });
    return res.send({ data: response });
  };

  public getIntegrationTeamsByUid = async (req: FastifyRequest, res: FastifyReply) => {
    const payload = integrationParamsSchema.safeParse(req.params);

    if (!payload.success) {
      return res.status(400).send(payload.error);
    }

    const response = await this.integrationUseCase.getIntegrationTeamsByIntegrationUid({
      integrationUid: payload.data.uid,
    });
    return res.send({ data: response });
  };
}

export const init = (router: FastifyInstance) => {
  const integrationUseCase = InitIntegrationUsecase();

  return new IntegrationHandler({ router, integrationUseCase });
};

export default init;


`;

const ast = tsquery.ast(typescript);
const nodes = tsquery(ast, 'Identifier[name="integrationUseCase"]');

// for (const node of nodes) {
//   console.log(nodes, tsquery(node.parent, 'CallExpression'));
// }

console.log(nodes[8].parent.parent);

// console.log(tsquery(nodes[8].parent, 'Identifier'));
