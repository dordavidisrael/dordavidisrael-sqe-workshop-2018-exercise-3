import assert from 'assert';
import {parseCode,bigFunc,parseCode1} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('1', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}\n'),parseCode1('1, 2, 3'),'function foo(x, y, z){\n' +
                '    let a = x + 1;\n' +
                '    let b = a + y;\n' +
                '    let c = 0;\n' +
                '    \n' +
                '    if (b < z) {\n' +
                '        c = c + 5;\n' +
                '    } else if (b < z * 2) {\n' +
                '        c = c + x + 5;\n' +
                '    } else {\n' +
                '        c = c + z + 5;\n' +
                '    }\n' +
                '    \n' +
                '    return c;\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' a = x + 1", style=filled,color=green,  shape=square ]\n' +
            'n2 [label="-2-\n' +
            ' b = a + y", style=filled,color=green,  shape=square ]\n' +
            'n3 [label="-3-\n' +
            ' c = 0", style=filled,color=green,  shape=square ]\n' +
            'n4 [label="-4-\n' +
            'b < z" , style=filled,color=green, shape=diamond]\n' +
            'n5 [label="-5-\n' +
            'c = c + 5", shape=squre]\n' +
            'n6 [label="-6-\n' +
            'return c", style=filled,color=green,shape=square]\n' +
            'n7 [label="-7-\n' +
            'b < z * 2" , style=filled,color=green, shape=diamond]\n' +
            'n8 [label="-8-\n' +
            'c = c + x + 5" , style=filled,color=green,  shape=square ]\n' +
            'n9 [label="-9-\n' +
            'c = c + z + 5", shape=squre]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n7 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n6 []\n' +
            'n9 -> n6 []'+'\n'
        );
    });
    it('2', () => {
        assert.equal(
            bigFunc(parseCode('function foo(){\n' +
                'let x=1;\n' +
                '}\n'),parseCode1(''),'function foo(){\n' +
                'let x=1;\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' x=1", style=filled,color=green,  shape=square ]'+'\n'
        );
    });
    it('3', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x){\n' +
                '\n' +
                'let dor=\'dor\';\n' +
                'let p=\'dor\';\n' +
                '\n' +
                'if(dor===p){\n' +
                'return 1;\n' +
                '}\n' +
                '\n' +
                '}\n'),parseCode1('1'),'function foo(x){\n' +
                '\n' +
                'let dor=\'dor\';\n' +
                'let p=\'dor\';\n' +
                '\n' +
                'if(dor===p){\n' +
                'return 1;\n' +
                '}\n' +
                '\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' dor=\'dor\'", style=filled,color=green,  shape=square ]\n' +
            'n2 [label="-2-\n' +
            ' p=\'dor\'", style=filled,color=green,  shape=square ]\n' +
            'n3 [label="-3-\n' +
            'dor===p" , style=filled,color=green, shape=diamond]\n' +
            'n4 [label="-4-\n' +
            'return 1", style=filled,color=green,shape=square]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="true"]'+'\n'
        );
    });
    it('4', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x){\n' +
                'let a=1;\n' +
                '}\n'),parseCode1('-1'),'function foo(x){\n' +
                'let a=1;\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' a=1", style=filled,color=green,  shape=square ]\n'
        );
    });
    it('5', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x){\n' +
                'let a=1;\n' +
                '\n' +
                'if(-1+2+2>0){\n' +
                'let z=2;\n' +
                '}\n' +
                '\n' +
                'if(1+1+(1+2)>0){\n' +
                'return 1;\n' +
                '}\n' +
                '\n' +
                '\n' +
                '}\n'),parseCode1('[1,1,1]'),'function foo(x){\n' +
                'let a=1;\n' +
                '\n' +
                'if(-1+2+2>0){\n' +
                'let z=2;\n' +
                '}\n' +
                '\n' +
                'if(1+1+(1+2)>0){\n' +
                'return 1;\n' +
                '}\n' +
                '\n' +
                '\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' a=1", style=filled,color=green,  shape=square ]\n' +
            'n2 [label="-2-\n' +
            '-1+2+2>0" , style=filled,color=green, shape=diamond]\n' +
            'n3 [label="-3-\n' +
            ' z=2", style=filled,color=green,  shape=square ]\n' +
            'n4 [label="-4-\n' +
            '1+1+(1+2)>0" , style=filled,color=green, shape=diamond]\n' +
            'n5 [label="-5-\n' +
            'return 1", style=filled,color=green,shape=square]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n4 [label="false"]\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n'
        );
    });
    it('6', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x){\n' +
                'let a=1;\n' +
                '\n' +
                'if(x[a]>0){\n' +
                'return 1;\n' +
                '}\n' +
                '}\n'),parseCode1('[1,1,1]'),'function foo(x){\n' +
                'let a=1;\n' +
                '\n' +
                'if(x[a]>0){\n' +
                'return 1;\n' +
                '}\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' a=1", style=filled,color=green,  shape=square ]\n' +
            'n2 [label="-2-\n' +
            'x[a]>0" , style=filled,color=green, shape=diamond]\n' +
            'n3 [label="-3-\n' +
            'return 1", style=filled,color=green,shape=square]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]'+'\n'
        );
    });
    it('7', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x){\n' +
                'let a=1;\n' +
                '\n' +
                'if(-a>-3){\n' +
                'return 2;\n' +
                '}\n' +
                '}\n'),parseCode1('1'),'function foo(x){\n' +
                'let a=1;\n' +
                '\n' +
                'if(-a>-3){\n' +
                'return 2;\n' +
                '}\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' a=1", style=filled,color=green,  shape=square ]\n' +
            'n2 [label="-2-\n' +
            '-a>-3" , style=filled,color=green, shape=diamond]\n' +
            'n3 [label="-3-\n' +
            'return 2", style=filled,color=green,shape=square]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]\n'
        );
    });
    it('8', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x){\n' +
                'let a=1;\n' +
                '}\n'),parseCode1('[1,2,-3]'),'function foo(x){\n' +
                'let a=1;\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' a=1", style=filled,color=green,  shape=square ]\n'
        );
    });
    it('9', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x){\n' +
                '\n' +
                'if(1>0){\n' +
                'return true;\n' +
                '}\n' +
                '\n' +
                'if(2>1){\n' +
                'let x=2;\n' +
                '}\n' +
                '\n' +
                '}\n'),parseCode1('1'),'function foo(x){\n' +
                '\n' +
                'if(1>0){\n' +
                'return true;\n' +
                '}\n' +
                '\n' +
                'if(2>1){\n' +
                'let x=2;\n' +
                '}\n' +
                '\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            '1>0" , style=filled,color=green, shape=diamond]\n' +
            'n2 [label="-2-\n' +
            'return true", style=filled,color=green,shape=square]\n' +
            'n3 [label="-3-\n' +
            '2>1", shape=diamond]\n' +
            'n4 [label="-4-\n' +
            ' x=2;", shape=squre]\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n3 [label="false"]\n' +
            'n3 -> n4 [label="true"]'+'\n'
        );
    });
    it('10', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x){\n' +
                'let y=1;\n' +
                'if(x[0]>-1){\n' +
                'let z=2;\n' +
                '}\n' +
                'if(x[0]+x[1]>2){\n' +
                'let z=4;\n' +
                '}\n' +
                '\n' +
                'if(1+2+3>1){\n' +
                'let p=2;\n' +
                '}\n' +
                '\n' +
                '}\n'),parseCode1('[1,2,3]'),'function foo(x){\n' +
                'let y=1;\n' +
                'if(x[0]>-1){\n' +
                'let z=2;\n' +
                '}\n' +
                'if(x[0]+x[1]>2){\n' +
                'let z=4;\n' +
                '}\n' +
                '\n' +
                'if(1+2+3>1){\n' +
                'let p=2;\n' +
                '}\n' +
                '\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' y=1", style=filled,color=green,  shape=square ]\n' +
            'n2 [label="-2-\n' +
            'x[0]>-1" , style=filled,color=green, shape=diamond]\n' +
            'n3 [label="-3-\n' +
            ' z=2", style=filled,color=green,  shape=square ]\n' +
            'n4 [label="-4-\n' +
            'x[0]+x[1]>2" , style=filled,color=green, shape=diamond]\n' +
            'n5 [label="-5-\n' +
            ' z=4", style=filled,color=green,  shape=square ]\n' +
            'n6 [label="-6-\n' +
            '1+2+3>1" , style=filled,color=green, shape=diamond]\n' +
            'n7 [label="-7-\n' +
            ' p=2", style=filled,color=green,  shape=square ]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 [label="true"]\n' +
            'n2 -> n4 [label="false"]\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n6 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 [label="true"]'+'\n'
        );
    });
    it('11', () => {
        assert.equal(
            bigFunc(parseCode('function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = 0;\n' +
                '   \n' +
                '   while (a < z) {\n' +
                '       c = a + b;\n' +
                '       z = c * 2;\n' +
                '       a = a + 1;\n' +
                '   }\n' +
                '   \n' +
                '   return z;\n' +
                '}\n'),parseCode1('1,2,3'),'function foo(x, y, z){\n' +
                '   let a = x + 1;\n' +
                '   let b = a + y;\n' +
                '   let c = 0;\n' +
                '   \n' +
                '   while (a < z) {\n' +
                '       c = a + b;\n' +
                '       z = c * 2;\n' +
                '       a = a + 1;\n' +
                '   }\n' +
                '   \n' +
                '   return z;\n' +
                '}\n'),
            'n1 [label="-1-\n' +
            ' a = x + 1", style=filled,color=green,  shape=square ]\n' +
            'n2 [label="-2-\n' +
            ' b = a + y", style=filled,color=green,  shape=square ]\n' +
            'n3 [label="-3-\n' +
            ' c = 0", style=filled,color=green,  shape=square ]\n' +
            'n4 [label="-4-\n' +
            'a < z" , style=filled,color=green, shape=diamond]\n' +
            'n5 [label="-5-\n' +
            'c = a + b" , style=filled,color=green,  shape=square ]\n' +
            'n6 [label="-6-\n' +
            'z = c * 2" , style=filled,color=green,  shape=square ]\n' +
            'n7 [label="-7-\n' +
            'a = a + 1" , style=filled,color=green,  shape=square ]\n' +
            'n8 [label="-8-\n' +
            'return z", style=filled,color=green,shape=square]\n' +
            'n1 -> n2 []\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n8 [label="false"]\n' +
            'n5 -> n6 []\n' +
            'n6 -> n7 []\n' +
            'n7 -> n4 []'+'\n'
        );
    });
    it('12', () => {
        assert.equal(
            bigFunc(parseCode('function b(){\n' +
                'let a=[1,2,3];\n' +
                'a=[2,4,-6];\n' +
                '}'),parseCode1(''),'function b(){\n' +
                'let a=[1,2,3];\n' +
                'a=[2,4,-6];\n' +
                '}'),
            'n1 [label="-1-\n' +
            ' a=[1,2,3]", style=filled,color=green,  shape=square ]\n' +
            'n2 [label="-2-\n' +
            'a=[2,4,-6]" , style=filled,color=green,  shape=square ]\n' +
            'n1 -> n2 []'+'\n'
        );
    });
    it('13', () => {
        assert.equal(
            bigFunc(parseCode('function b(){\n' +
                'while(1>0){}\n' +
                '}'),parseCode1(''),'function b(){\n' +
                'while(1>0){}\n' +
                '}'),
            'n1 [label="-1-\n' +
            '1>0" , style=filled,color=green, shape=diamond]\n' +
            'n1 -> n1 [label="true"]'+'\n'
        );
    });




});
