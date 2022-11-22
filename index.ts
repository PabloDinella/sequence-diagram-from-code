import * as astq from 'astq';
import { ASTQAdapterTypeScript } from 'astq-ts';
import * as typescript from 'typescript';

export class QueryEngineWrapper {
  queryEngine;

  constructor() {
   this.queryEngine = new astq();
   // The adapter takes a reference to your typescript install in its constructor to make sure the node types match your version
   this.queryEngine.adapter(new ASTQAdapterTypeScript(typescript));
  }

  public querySource(tsAST: any, query: string, queryOptions?: any): any[] {
   return astq.query(tsAST, query, queryOptions);
  }

}

const myTree = createASTFromSource(sampleSource);
const wrapper = new QueryEngineWrapper();

wrapper.querySource(myTree, sampleQuery).forEach((node) => {
 console.log(`${node.name.escapedText}: ${node.initializer.text}`);
})

/**
 * Prints
 * bar: quux
 * baz: 42
 */

function createASTFromSource(source: string, fileName?: string = 'test.js') {
    return typescript.createSourceFromFile(fileName, source, typescript.ScriptTarget.Latest, true);
}

const sampleSource = `
    class Foo {
        foo () {
            const bar = "quux"
            let baz = 42
        }
    }
`

const sampleQuery = `
// VariableDeclaration [
  /:name   Identifier [ @escapedText ]
  &&
  (/:initializer StringLiteral [ @text ] || /:initializer * [ @text ])
]

`
