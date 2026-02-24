"""
BA-07 Code Execution Tools
Ermöglicht BA-07 Python-Code direkt auszuführen.
"""
try:
    from google.adk.tools import google_code_interpreter as built_in_code_execution
except ImportError:
    try:
        from google.adk.tools import code_execution as built_in_code_execution
    except ImportError:
        built_in_code_execution = None

# This tool is used in agent.py for autonomous data normalization
