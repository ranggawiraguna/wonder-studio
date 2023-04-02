import Component from './styled';
import useFitText from 'use-fit-text';

export default function AutoSizeText({ ...props }) {
  const { fontSize, ref } = useFitText({
    minFontSize: -300,
    maxFontSize: 300,
    logLevel: 'none'
  });

  return (
    <Component ref={ref} style={{ fontSize }} variant="p" component="p">
      {props.children}
    </Component>
  );
}
