const Example = () => {
  return (
    <>
      {0 && <Something />}
      {/* React: renders undesired 0 */}

      {NaN && <Something />}
      {/* React: renders undesired NaN */}

      {'' && <Something />}
      {/* React: renders nothing */}
    </>
  )
}
