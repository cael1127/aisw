# DeepSeek-R1-Distill Models Usage Guide

## Overview

DeepSeek-R1-Distill models can be utilized in the same manner as Qwen or Llama models, providing a powerful and efficient option for various AI applications.

## Deployment Options

### Using vLLM

You can easily start a service using vLLM:

```bash
vllm serve deepseek-ai/DeepSeek-R1-Distill-Qwen-32B --tensor-parallel-size 2 --max-model-len 32768 --enforce-eager
```

### Using SGLang

You can also easily start a service using SGLang:

```bash
python3 -m sglang.launch_server --model deepseek-ai/DeepSeek-R1-Distill-Qwen-32B --trust-remote-code --tp 2
```

## Usage Recommendations

We recommend adhering to the following configurations when utilizing the DeepSeek-R1 series models, including benchmarking, to achieve the expected performance:

### Temperature Settings
- **Range**: 0.5-0.7 (0.6 is recommended)
- **Purpose**: Prevents endless repetitions or incoherent outputs

### Prompt Structure
- **Avoid system prompts**: All instructions should be contained within the user prompt
- **Mathematical problems**: Include a directive in your prompt such as: "Please reason step by step, and put your final answer within \boxed{}."

### Evaluation Guidelines
- **Multiple tests**: Conduct multiple tests and average the results when evaluating model performance

### Thinking Pattern Enforcement
The DeepSeek-R1 series models tend to bypass thinking pattern (i.e., outputting "<think>\n\n</think>") when responding to certain queries, which can adversely affect the model's performance.

**Solution**: To ensure that the model engages in thorough reasoning, we recommend enforcing the model to initiate its response with "<think>\n" at the beginning of every output.

## Model Variants

- `deepseek-ai/DeepSeek-R1-Distill-Qwen-32B` - 32B parameter model based on Qwen architecture

## Best Practices

1. **Temperature Control**: Always use temperature between 0.5-0.7 for optimal results
2. **Prompt Design**: Keep all instructions in user prompts, avoid system prompts
3. **Mathematical Reasoning**: Use explicit step-by-step reasoning prompts
4. **Thinking Enforcement**: Force models to start with "<think>\n" for better reasoning
5. **Performance Evaluation**: Run multiple tests and average results for accurate assessment

## Example Usage

```python
# Example prompt for mathematical reasoning
prompt = """Please reason step by step, and put your final answer within \\boxed{}.

Solve the equation: 2x + 5 = 13"""
```

This guide ensures optimal performance and reliable results when working with DeepSeek-R1-Distill models. 